<script setup lang="ts">
import { useSurveys } from '~/composables/useSurveys';
import { useSurveyResponses } from '~/composables/useSurveyResponses';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Textarea from '@/components/ui/textarea.vue';
import RadioGroup from '@/components/ui/radio-group.vue';
import Label from '@/components/ui/label.vue';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from '#app';

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;
const { findSurvey, surveys } = useSurveys();
const { setSurveyResponse, addSurveySlug } = useSurveyResponses();
const survey = findSurvey(slug);

if (survey) {
  addSurveySlug(slug);
}

// Trending heuristic shared with list page (first 3)
const TRENDING_COUNT = 3;
const isTrending = computed(() => !!survey && surveys.slice(0, TRENDING_COUNT).some(s => s.slug === survey.slug));

const formState = ref<Record<string, any>>({});
survey?.questions.forEach(q => { if (q.type !== 'section') formState.value[q.id] = ''; });
const submitting = ref(false);
const submitted = ref(false);
const errorMsg = ref<string | null>(null);

const totalAnswerables = computed(() => survey ? survey.questions.filter(q => q.type !== 'section').length : 0);
const answeredCount = computed(() => survey ? survey.questions.filter(q => q.type !== 'section' && formState.value[q.id]).length : 0);
const progress = computed(() => totalAnswerables.value === 0 ? 0 : Math.round((answeredCount.value / totalAnswerables.value) * 100));

const canSubmit = computed(() => {
  if (!survey) return false;
  return survey.questions.every(q => q.type === 'section' || !q.required || formState.value[q.id]);
});

async function submit() {
  if (!survey || submitting.value || !canSubmit.value) return;
  submitting.value = true;
  errorMsg.value = null;
  try {
    setSurveyResponse(survey.slug, formState.value);
    const formData = new FormData();
    for (const [field, value] of Object.entries(formState.value)) {
      if (value) { // Only include non-empty values
        const entryKey = survey.googleForm.entryMap[field] || field; // Use field ID as fallback
        formData.append(entryKey, value as any);
      }
    }

    formData.append('slug', survey.slug);
    
    // Debug: Log what we're sending
    console.log('FormData being sent:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // First, try with CORS to get proper response
    try {
      const response = await fetch(survey.googleForm.action, {
        method: 'POST',
        mode: 'cors',
        body: formData,
        // Don't set Content-Type - let browser set it for FormData
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        submitted.value = true;
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (corsError) {
      console.log('CORS failed, trying no-cors mode:', corsError);
      
      // Fallback to no-cors mode
      await fetch(survey.googleForm.action, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      
      // With no-cors, we assume success if no network error occurred
      console.log('No-cors request completed - assuming success');
      submitted.value = true;
    }
  } catch (error) {
    console.error('Submit error:', error);
    errorMsg.value = error instanceof Error ? error.message : 'Submission failed';
  } finally {
    submitting.value = false;
  }

}

function goBack() { router.push('/survey'); }

function resetForm() {
  submitted.value = false;
  Object.keys(formState.value).forEach(k => (formState.value[k] = ''));
}

// Optional auto-focus first input
watch(() => survey, () => {
  requestAnimationFrame(() => {
    const el = document.querySelector('[data-autofocus]') as HTMLElement | null;
    el?.focus();
  });
});
</script>
<template>
  <div v-if="survey" class="max-w-5xl mx-auto py-10 px-4 space-y-10">
    <!-- Header -->
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-3">
          <button @click="goBack" class="group inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition" aria-label="Back to surveys">
            <svg viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5 -ml-0.5 transition-transform group-hover:-translate-x-0.5"><path d="M12 15l-5-5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-3xl font-bold tracking-tight flex items-center gap-3">{{ survey.title }}
              <span v-if="isTrending" class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ring-amber-500/30 animate-pulse">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Trending
              </span>
            </h1>
          </div>
          <p class="text-muted-foreground max-w-prose">{{ survey.description }}</p>
        </div>
        <div class="hidden md:flex items-center gap-3">
          <div class="text-right">
            <p class="text-xs uppercase tracking-wide text-muted-foreground">Progress</p>
            <p class="font-semibold text-sm tabular-nums">{{ progress }}%</p>
          </div>
          <div class="w-36 h-2 rounded-full bg-muted overflow-hidden">
            <div class="h-full bg-primary transition-all duration-300" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
      <!-- Mobile progress -->
      <div class="md:hidden flex items-center gap-3">
        <div class="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div class="h-full bg-primary transition-all duration-300" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="text-xs font-medium tabular-nums">{{ progress }}%</span>
      </div>
    </div>

    <!-- Form Card -->
    <div v-if="!submitted" class="relative rounded-2xl border bg-gradient-to-br from-background to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/50"></div>
      <form @submit.prevent="submit" class="relative p-6 md:p-10 space-y-10">
        <transition-group name="q-fade" tag="div" class="space-y-10">
          <template v-for="(q, index) in survey.questions" :key="q.id || 'section-'+index">
            <!-- Section Block -->
            <div v-if="q.type === 'section'" class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">{{ (index+1) }}</div>
                <h2 class="text-lg font-semibold tracking-tight">{{ q.title }}</h2>
              </div>
              <p v-if="q.description" class="text-sm text-muted-foreground ml-10">{{ q.description }}</p>
              <div class="h-px bg-border/70 mt-4"></div>
            </div>
            <!-- Field Block -->
            <div v-else class="group space-y-3 rounded-lg p-4 -m-1 hover:bg-accent/40 focus-within:bg-accent/40 transition">
              <div class="flex items-center gap-2">
                <Label :for-id="q.id" class="flex-1">{{ q.label }} <span v-if="q.required" class="text-destructive" aria-hidden="true">*</span></Label>
                <span class="text-[10px] uppercase tracking-wide text-muted-foreground">{{ answeredCount }}/{{ totalAnswerables }}</span>
              </div>
              <component
                :is="q.type === 'textarea' ? Textarea : q.type === 'radio' ? RadioGroup : Input"
                v-model="formState[q.id]"
                :id="q.id"
                :name="q.id"
                :placeholder="q.placeholder"
                :options="q.type==='radio' ? (q as any).options : undefined"
                :required="q.required"
                :data-autofocus="index===0 ? true : undefined"
                :type="q.type === 'email' ? 'email' : 'text'"
              />
            </div>
          </template>
        </transition-group>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
          <Button :disabled="!canSubmit || submitting" type="submit" class="sm:w-auto w-full">
            <span v-if="!submitting">Submit Survey</span>
            <span v-else class="inline-flex items-center gap-2">Submitting
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
            </span>
          </Button>
          <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>
          <p v-else class="text-xs text-muted-foreground">All data submitted anonymously unless specified.</p>
        </div>
      </form>
    </div>

    <!-- Submitted State -->
    <div v-else class="relative rounded-2xl border bg-gradient-to-br from-background to-background/80 backdrop-blur p-10 text-center space-y-6">
      <div class="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <svg viewBox="0 0 20 20" fill="none" class="h-7 w-7"><path d="M4.5 10.5L8 14l7.5-8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2 class="text-2xl font-semibold tracking-tight">Thank you!</h2>
      <p class="text-muted-foreground max-w-md mx-auto">Your responses have been recorded. We appreciate your time and input—it directly shapes future improvements.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="secondary" @click="router.push('/survey')">Back to Surveys</Button>
        <Button variant="outline" @click="resetForm">Fill Again</Button>
      </div>
    </div>
  </div>
  <!-- Not Found -->
  <div v-else class="max-w-xl mx-auto py-24 text-center space-y-6">
    <div class="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
      <svg viewBox="0 0 20 20" fill="none" class="h-7 w-7"><path d="M10 6v4m0 4h.01M10 2a8 8 0 100 16 8 8 0 000-16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <h1 class="text-3xl font-bold tracking-tight">Survey Not Found</h1>
    <p class="text-muted-foreground">The survey you are looking for may have been removed or the link is incorrect.</p>
    <Button variant="outline" @click="router.push('/survey')">Return to list</Button>
  </div>
</template>

<style scoped>
.q-fade-enter-active, .q-fade-leave-active { transition: all 260ms cubic-bezier(.4,0,.2,1); }
.q-fade-enter-from, .q-fade-leave-to { opacity: 0; transform: translateY(4px); }
</style>
