<script setup lang="ts">
import { useSurveys } from '~/composables/useSurveys'
import { useSurveyResponses } from '~/composables/useSurveyResponses'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Textarea from '@/components/ui/textarea.vue'
import RadioGroup from '@/components/ui/radio-group.vue'
import Label from '@/components/ui/label.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const { findSurvey } = useSurveys()
const { setSurveyResponse, addSurveySlug, getSurveyResponse, getSurveySubmissionId, isSurveySubmitted } = useSurveyResponses()
const survey = findSurvey(slug)

if (survey) {
  addSurveySlug(slug)
}

useHead(() => ({
  title: survey ? `${survey.title} | Kazansky.dev` : 'Survey | Kazansky.dev',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
}))

// Trending heuristic shared with list page (first 3)

const formState = ref<Record<string, string>>({})
survey?.questions.forEach((q) => {
  if (q.type !== 'section')
    formState.value[q.id] = ''
})

const isScrolledToBottom = ref(false)

const handleScroll = () => {
  const buffer = 100 // px buffer to trigger "at bottom" a bit early
  const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - buffer
  if (isAtBottom !== isScrolledToBottom.value) {
    isScrolledToBottom.value = isAtBottom
  }
}

onMounted(() => {
  if (survey) {
    const savedResponse = getSurveyResponse(slug)
    if (savedResponse) {
      formState.value = { ...formState.value, ...savedResponse }
    }
  }

  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial check
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref<string | null>(null)
const existingSubmissionId = ref<string | null>(null)
const isEditingSubmission = ref(false)

onMounted(() => {
  // Check if this survey was already submitted - only on client
  if (survey) {
    existingSubmissionId.value = getSurveySubmissionId(survey.slug)
    isEditingSubmission.value = isSurveySubmitted(survey.slug)
  }

  if (survey) {
    const savedResponse = getSurveyResponse(slug)
    if (savedResponse) {
      formState.value = { ...formState.value, ...savedResponse }
    }
  }

  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial check
})

const totalAnswerables = computed(() => survey ? survey.questions.filter(q => q.type !== 'section').length : 0)
const answeredCount = computed(() => survey ? survey.questions.filter(q => q.type !== 'section' && formState.value[q.id]).length : 0)
const progress = computed(() => totalAnswerables.value === 0 ? 0 : Math.round((answeredCount.value / totalAnswerables.value) * 100))

const canSubmit = computed(() => {
  if (!survey) return false
  return survey.questions.every(q => q.type === 'section' || !q.required || formState.value[q.id])
})

async function submit() {
  if (!survey || submitting.value || !canSubmit.value) return
  submitting.value = true
  errorMsg.value = null

  try {
    // Build structured payload with slug and question-answer pairs
    const questions = []
    for (const q of survey.questions) {
      if (q.type !== 'section') {
        const value = formState.value[q.id]
        if (value) {
          questions.push({
            question: q.label,
            answer: value,
          })
        }
      }
    }

    const payload: {
      slug: string
      questions: Array<{ question: string, answer: string }>
      submissionId?: string
      isUpdate?: boolean
    } = {
      slug: survey.slug,
      questions: questions,
    }

    // If this is an update to existing submission, include the submission ID
    if (existingSubmissionId.value && isEditingSubmission.value) {
      payload.submissionId = existingSubmissionId.value
      payload.isUpdate = true
    }

    const response = await fetch(survey.action, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Try to parse the response to get submission ID
    let submissionId = existingSubmissionId.value
    try {
      if (response.ok) {
        const responseData = await response.json()
        if (responseData.submissionId) {
          submissionId = responseData.submissionId
        }
      }
    }
    catch (parseError) {
      // If we can't parse response or no submission ID, continue with existing flow
      console.log('Could not parse webhook response for submission ID:', parseError)
    }

    // Save the response with submission ID and mark as submitted
    setSurveyResponse(survey.slug, formState.value, submissionId || undefined, true)
    submitted.value = true
  }
  catch (error) {
    console.error('Submission error:', error)
    errorMsg.value = error instanceof Error ? error.message : 'Ошибка при отправке'
  }
  finally {
    submitting.value = false
  }
}

function goBack() {
  router.push('/survey')
}

function editResponses() {
  submitted.value = false
  if (survey) {
    existingSubmissionId.value = getSurveySubmissionId(survey.slug)
    isEditingSubmission.value = isSurveySubmitted(survey.slug)
  }
}

// Optional auto-focus first input
watch(() => survey, () => {
  requestAnimationFrame(() => {
    const el = document.querySelector('[data-autofocus]') as HTMLElement | null
    el?.focus()
  })
})
</script>

<template>
  <div v-if="survey" class="max-w-7xl mx-auto py-10 px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 md:gap-10 lg:gap-16">
      <!-- Main Content (Left Column) -->
      <div class="md:col-span-2 space-y-10">
        <!-- Header -->
        <div class="space-y-6">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-3">
              <button class="group inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition" aria-label="Назад к опросам" @click="goBack">
                <svg viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5 -ml-0.5 transition-transform group-hover:-translate-x-0.5"><path
                  d="M12 15l-5-5 5-5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg>
                Назад
              </button>
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-3xl font-bold tracking-tight flex items-center gap-3">
                  {{ survey.title }}
                </h1>
              </div>
              <p class="text-muted-foreground max-w-prose">
                {{ survey.description }}
              </p>
              <div v-if="isEditingSubmission" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z" />
                </svg>
                Редактирование ранее отправленного опроса
              </div>
            </div>
            <!-- Desktop progress removed from here -->
          </div>
          <!-- Mobile progress -->
          <div class="md:hidden flex items-center gap-3">
            <div class="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div class="h-full bg-primary transition-all duration-300" :style="{ width: progress + '%' }" />
            </div>
            <span class="text-xs font-medium tabular-nums">{{ progress }}%</span>
          </div>
        </div>

        <!-- Form Card -->
        <div v-if="!submitted" class="relative rounded-2xl border bg-gradient-to-br from-background to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/50" />
          <form class="relative p-6 md:p-10 space-y-10" @submit.prevent="submit">
            <div class="space-y-10">
              <template v-for="(q, index) in survey.questions" :key="q.id || 'section-'+index">
                <!-- Section Block -->
                <div v-if="q.type === 'section'" class="space-y-2">
                  <div class="flex items-center gap-3">
                    <div class="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                      {{ (index+1) }}
                    </div>
                    <h2 class="text-lg font-semibold tracking-tight">
                      {{ q.title }}
                    </h2>
                  </div>
                  <p v-if="q.description" class="text-sm text-muted-foreground ml-10">
                    {{ q.description }}
                  </p>
                  <div class="h-px bg-border/70 mt-4" />
                </div>
                <!-- Field Block -->
                <div v-else class="group space-y-3 rounded-lg p-4 -m-1 hover:bg-accent/40 focus-within:bg-accent/40 transition">
                  <div class="flex items-center gap-2">
                    <Label :for-id="q.id" class="flex-1">{{ q.label }} <span v-if="q.required" class="text-destructive" aria-hidden="true">*</span></Label>
                    <span class="text-[10px] uppercase tracking-wide text-muted-foreground">{{ answeredCount }}/{{ totalAnswerables }}</span>
                  </div>
                  <component
                    :is="q.type === 'textarea' ? Textarea : q.type === 'radio' ? RadioGroup : Input"
                    :id="q.id"
                    v-model="formState[q.id]"
                    :name="q.id"
                    :placeholder="q.placeholder"
                    :options="q.type==='radio' ? (q as any).options : undefined"
                    :required="q.required"
                    :data-autofocus="index===0 ? true : undefined"
                    :type="q.type === 'email' ? 'email' : 'text'"
                  />
                </div>
              </template>
            </div>

            <!-- Mobile Submit Button -->
            <div class="md:hidden pt-6 border-t">
              <Button
                :disabled="!canSubmit || submitting || !isScrolledToBottom"
                type="submit"
                class="w-full"
              >
                <span v-if="!submitting">
                  {{ isEditingSubmission ? 'Обновить ответы' : 'Отправить' }}
                </span>
                <span v-else class="inline-flex items-center gap-2">
                  {{ isEditingSubmission ? 'Обновление...' : 'Отправка...' }}
                  <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                </span>
              </Button>
              <p v-if="errorMsg" class="text-sm text-destructive text-center mt-3">
                {{ errorMsg }}
              </p>
              <p v-else class="text-xs text-muted-foreground text-center mt-3">
                Данные отправляются анонимно, если не указано иное.
              </p>
            </div>
          </form>
        </div>

        <!-- Submitted State (Main Column) -->
        <div v-else class="relative rounded-2xl border bg-gradient-to-br from-background to-background/80 backdrop-blur p-10 text-center space-y-6">
          <div class="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg viewBox="0 0 20 20" fill="none" class="h-7 w-7"><path
              d="M4.5 10.5L8 14l7.5-8"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg>
          </div>
          <h2 class="text-2xl font-semibold tracking-tight">
            Спасибо!
          </h2>
          <p class="text-muted-foreground max-w-md mx-auto">
            Ваши ответы были записаны. Мы ценим ваше время и мнение — это напрямую влияет на будущие улучшения.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="secondary" @click="router.push('/survey')">
              Назад к опросам
            </Button>
            <Button variant="outline" @click="editResponses">
              Изменить ответы
            </Button>
          </div>
        </div>
      </div>

      <!-- Sidebar (Right Column) -->
      <div class="hidden md:block md:col-span-1">
        <div class="sticky top-24 space-y-6">
          <!-- Progress Card -->
          <div class="rounded-2xl border bg-gradient-to-br from-background to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 shadow-sm">
            <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/50" />
            <div class="relative space-y-4">
              <p class="text-sm font-medium">
                Прогресс
              </p>
              <div class="flex items-center gap-3">
                <div class="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-300" :style="{ width: progress + '%' }" />
                </div>
                <span class="text-sm font-semibold tabular-nums">{{ progress }}%</span>
              </div>
            </div>
          </div>

          <!-- Submit Card -->
          <div v-if="!submitted" class="rounded-2xl border bg-gradient-to-br from-background to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 shadow-sm">
            <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/50" />
            <div class="relative space-y-4">
              <Button
                :disabled="!canSubmit || submitting || !isScrolledToBottom"
                type="button"
                class="w-full"
                @click="submit"
              >
                <span v-if="!submitting">
                  {{ isEditingSubmission ? 'Обновить ответы' : 'Отправить' }}
                </span>
                <span v-else class="inline-flex items-center gap-2">
                  {{ isEditingSubmission ? 'Обновление...' : 'Отправка...' }}
                  <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                </span>
              </Button>
              <p v-if="errorMsg" class="text-sm text-destructive text-center">
                {{ errorMsg }}
              </p>
              <p v-else class="text-xs text-muted-foreground text-center">
                Данные отправляются анонимно, если не указано иное.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Not Found -->
  <div v-else class="max-w-xl mx-auto py-24 text-center space-y-6">
    <div class="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
      <svg viewBox="0 0 20 20" fill="none" class="h-7 w-7"><path
        d="M10 6v4m0 4h.01M10 2a8 8 0 100 16 8 8 0 000-16z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg>
    </div>
    <h1 class="text-3xl font-bold tracking-tight">
      Опрос не найден
    </h1>
    <p class="text-muted-foreground">
      Возможно, опрос был удалён или ссылка некорректна.
    </p>
    <Button variant="outline" @click="router.push('/survey')">
      Вернуться к списку
    </Button>
  </div>
</template>
