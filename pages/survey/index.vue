<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSurveys } from '~/composables/useSurveys';

const { surveys: rawSurveys } = useSurveys();

// Basic heuristic: trending = first 3 (placeholder for future metrics)
const TRENDING_COUNT = 3;

const query = ref('');
// Potential future category filter placeholder
const activeFilter = ref<'all' | 'trending'>('all');

const filtered = computed(() => {
  let list = [...rawSurveys];
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

function setFilter(f: 'all' | 'trending') {
  activeFilter.value = f;
}
</script>
<template>
  <div class="max-w-6xl mx-auto py-10 px-4 space-y-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Surveys</h1>
        <p class="text-muted-foreground mt-2 max-w-prose">Discover and respond to our latest feedback forms. Your insights help us build better experiences.</p>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-72">
          <input
            v-model="query"
            type="text"
            placeholder="Search surveys..."
            aria-label="Search surveys"
            class="w-full rounded-md border bg-background/60 backdrop-blur px-3 py-2 pr-9 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-sm">⌘K</span>
        </div>
        <div class="inline-flex rounded-md border p-1 bg-background/60 backdrop-blur text-xs font-medium">
          <button
            class="px-3 py-1 rounded-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            :class="activeFilter === 'all' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'"
            @click="setFilter('all')"
          >All</button>
          <button
            class="px-3 py-1 rounded-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            :class="activeFilter === 'trending' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'"
            @click="setFilter('trending')"
          >Trending</button>
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
                <span
                  v-if="i < TRENDING_COUNT"
                  class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ring-amber-500/30 animate-pulse"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  Trending
                </span>
              </div>
              <p class="mt-1 text-muted-foreground text-xs line-clamp-2">{{ s.description }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span class="inline-flex items-center gap-1">
              <svg viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3.5 10.5L8 15l8.5-10" /></svg>
              Quick</span>
            <span>•</span>
            <span>~5 min</span>
          </div>
          <div class="mt-5 flex items-center gap-2 text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
            <span>Start</span>
            <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4"><path d="M7 5l6 5-6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </NuxtLink>
      </li>
    </transition-group>

    <!-- Empty State -->
    <div v-if="isEmpty" class="text-center py-20 border-2 border-dashed rounded-xl">
      <p class="text-sm text-muted-foreground">No surveys match your search.</p>
      <button
        class="mt-4 inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="query = ''"
      >
        Reset search
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
