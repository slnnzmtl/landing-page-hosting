<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSurveys } from '~/composables/useSurveys';
import { useSurveyResponses } from '~/composables/useSurveyResponses';

const { surveys: rawSurveys } = useSurveys();
const { getSurveyResponses } = useSurveyResponses();

const surveys = computed(() => {
  const responses = getSurveyResponses();
  const slugs = responses.map(r => r.slug);
  return rawSurveys.filter(s => slugs.includes(s.slug));
});

// Basic heuristic: trending = first 3 (placeholder for future metrics)
const TRENDING_COUNT = 3;

const query = ref('');
// Potential future category filter placeholder
const activeFilter = ref<'all' | 'trending'>('all');

const filtered = computed(() => {
  let list = [...surveys.value];
  if (activeFilter.value === 'trending') {
    list = list.slice(0, TRENDING_COUNT);
  }
  if (query.value.trim()) {
    const q = query.value.toLowerCase();
    list = list.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q)
    );
  }
  return list;
});

const isEmpty = computed(() => filtered.value.length === 0);

// Set of slugs that have saved local responses
const savedSlugs = computed(() => new Set(getSurveyResponses().map(r => r.slug)));
</script>
<template>
  <div class="max-w-6xl mx-auto py-10 px-4 space-y-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
  <a href="https://kazansky.dev" target="_blank" rel="noopener" class="hover:underline ">
    <h1 class="text-3xl font-bold tracking-tight">Kazansky.dev</h1>
  </a>
  <p class="text-muted-foreground mt-2 max-w-prose">
    Короткие брифы для проектов по разработке ПО.  сохранённые ответы доступны для редактирования.
  </p>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-72">
          <input
            v-model="query"
            type="text"
            placeholder="Поиск брифов..."
            aria-label="Поиск брифов"
            class="w-full rounded-md border bg-background/60 backdrop-blur px-3 py-2 pr-9 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-sm">⌘K</span>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <transition-group
      name="survey-grid"
      tag="ul"
      class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      appear
    >
      <li
        v-for="(s, i) in filtered"
        :key="s.slug"
        class="group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br from-background to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-5 shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-primary"
      >
        <!-- Accent Ring / Glow -->
        <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
          <div class="absolute -inset-px rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-md"></div>
        </div>
        <NuxtLink :to="`/survey/${s.slug}`" class="flex flex-1 flex-col" aria-label="Open survey: {{ s.title }}">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {{ s.title.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h2 class="text-base font-semibold leading-tight truncate">{{ s.title }}</h2>
              </div>
              <p class="mt-1 text-muted-foreground text-xs line-clamp-2">{{ s.description }}</p>
            </div>
          </div>
          <div class="mt-5 flex items-center gap-2 text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
            <span>{{ savedSlugs.has(s.slug) ? 'Изменить ответы' : 'Начать' }}</span>
            <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4"><path d="M7 5l6 5-6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </NuxtLink>
      </li>
    </transition-group>

    <!-- Empty State -->
      <div v-if="isEmpty" class="text-center py-20 border-2 border-dashed rounded-xl">
      <p class="text-sm text-muted-foreground">Ничего не найдено по вашему запросу.</p>
      <button
        class="mt-4 inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="query = ''"
      >
        Сбросить поиск
      </button>
    </div>
  </div>
</template>

<style scoped>
.survey-grid-enter-active,
.survey-grid-leave-active {
  transition: all 300ms cubic-bezier(.4,0,.2,1);
}
.survey-grid-enter-from,
.survey-grid-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(.98);
}
</style>
