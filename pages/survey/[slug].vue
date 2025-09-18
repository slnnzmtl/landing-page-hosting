<script setup lang="ts">
import surveys from './surveys.json';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Textarea from '@/components/ui/textarea.vue';
import RadioGroup from '@/components/ui/radio-group.vue';
import Label from '@/components/ui/label.vue';
import { ref, computed } from 'vue';
import { useRoute } from '#app';

interface QuestionBase { id: string; label: string; type: string; required?: boolean; placeholder?: string; }
interface TextQ extends QuestionBase { type: 'text' | 'email'; }
interface TextareaQ extends QuestionBase { type: 'textarea'; }
interface RadioQ extends QuestionBase { type: 'radio'; options: { label: string; value: string }[] }
interface SurveyDef { slug: string; title: string; description: string; questions: (TextQ|TextareaQ|RadioQ)[]; googleForm: { action: string; entryMap: Record<string,string>; formId: string } }

const route = useRoute();
const slug = route.params.slug as string;
const survey = (surveys as any as SurveyDef[]).find(s => s.slug === slug);
const notFound = !survey;

const formState = ref<Record<string, any>>({});
survey?.questions.forEach(q => { formState.value[q.id] = ''; });
const submitting = ref(false);
const submitted = ref(false);
const errorMsg = ref<string | null>(null);

const canSubmit = computed(() => {
  if (!survey) return false;
  return survey.questions.every(q => !q.required || formState.value[q.id]);
});

async function submit() {
  if (!survey) return;
  submitting.value = true; errorMsg.value = null;
  try {
    const formData = new FormData();
    for (const [field, value] of Object.entries(formState.value)) {
      const entryKey = survey.googleForm.entryMap[field];
      if (entryKey) formData.append(entryKey, value as any);
    }
    // Google forms expects an empty 'fvv' and 'partialResponse' etc sometimes; minimal works with the mapped entries.
    const res = await fetch(survey.googleForm.action, { method: 'POST', mode: 'no-cors', body: formData });
    // mode:no-cors will opaque the response; assume success
    submitted.value = true;
  } catch (e:any) {
    errorMsg.value = e.message || 'Submission failed';
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <div class="max-w-3xl mx-auto py-10 px-4" v-if="!notFound">
    <div class="space-y-2 mb-8">
      <h1 class="text-3xl font-bold tracking-tight">{{ survey.title }}</h1>
      <p class="text-muted-foreground">{{ survey.description }}</p>
    </div>

    <form v-if="!submitted" class="space-y-6" @submit.prevent="submit">
      <div v-for="q in survey.questions" :key="q.id" class="space-y-2">
        <Label :for-id="q.id">{{ q.label }} <span v-if="q.required" class="text-destructive">*</span></Label>
        <component :is="
            q.type === 'textarea' ? Textarea :
            q.type === 'radio' ? RadioGroup : Input
          "
          v-model="formState[q.id]"
          :id="q.id"
          :name="q.id"
          :placeholder="q.placeholder"
          :options="q.type==='radio' ? (q as any).options : undefined"
          :required="q.required"
          :type="q.type === 'email' ? 'email' : 'text'"
        />
      </div>
      <div class="flex items-center gap-4">
        <Button :disabled="!canSubmit || submitting" type="submit">{{ submitting ? 'Submitting...' : 'Submit' }}</Button>
        <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>
      </div>
    </form>

    <div v-else class="p-6 border rounded-lg bg-accent/40">
      <h2 class="text-xl font-semibold mb-2">Thank you!</h2>
      <p class="text-muted-foreground">Your responses have been recorded.</p>
      <NuxtLink to="/survey" class="inline-block mt-4 text-sm text-primary underline">Back to surveys</NuxtLink>
    </div>
  </div>
  <div v-else class="max-w-xl mx-auto py-20 text-center space-y-4">
    <h1 class="text-3xl font-bold">Survey Not Found</h1>
    <NuxtLink to="/survey" class="text-primary underline">Return to list</NuxtLink>
  </div>
</template>
