<script setup lang="ts">
import { useSurveys } from '~/composables/useSurveys';
const { surveys: surveyList } = useSurveys();
</script>
<template>
  <div class="max-w-3xl mx-auto py-10 px-4 space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Surveys</h1>
      <p class="text-muted-foreground mt-2">Select a survey to begin.</p>
    </div>
    <ul class="space-y-4">
      <li v-for="s in surveyList" :key="s.slug" class="p-5 border rounded-lg hover:bg-accent transition">
        <NuxtLink :to="`/survey/${s.slug}`" class="block">
          <h2 class="text-xl font-semibold">{{ s.title }}</h2>
          <p class="text-sm text-muted-foreground mt-1">{{ s.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
