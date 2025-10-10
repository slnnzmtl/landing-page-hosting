<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSurveys } from '~/composables/useSurveys'
import { useSurveyResponses } from '~/composables/useSurveyResponses'

const services = [
  {
    title: 'Web Development',
    description: 'Designing and building modern web applications with Vue, Nuxt, and robust backend integrations.',
  },
  {
    title: 'AI & Automation',
    description: 'Delivering intelligent workflows, chatbots, and automation systems tailored to your business goals.',
  },
  {
    title: 'Product Strategy',
    description: 'Partnering from discovery to launch with clear roadmaps, estimation, and UX-centered delivery.',
  },
]

// Survey integration
const { surveys } = useSurveys()
const { getSurveyResponses } = useSurveyResponses()
const mounted = ref(false)
const savedSlugs = ref<Set<string>>(new Set())
const submittedSlugs = ref<Set<string>>(new Set())

// Show top 3 surveys or featured ones
const displayedSurveys = computed(() => surveys.slice(0, 3))

onMounted(() => {
  const responses = getSurveyResponses()
  savedSlugs.value = new Set(responses.map(r => r.slug))
  submittedSlugs.value = new Set(responses.filter(r => r.isSubmitted).map(r => r.slug))
  mounted.value = true
})

const highlights = [
  'Full-stack expertise across Vue, React, TypeScript, and Python.',
  'Hands-on experience delivering complex marketplaces, CRM systems, and SaaS platforms.',
  'Client-first approach focused on measurable outcomes and long-term collaboration.',
]

const contacts = [
  {
    label: 'Email',
    href: 'mailto:kazanskydaniel@gmail.com',
    text: 'kazanskydaniel@gmail.com',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/daniel-kazansky',
    text: 'linkedin.com/in/daniel-kazansky',
  },
  {
    label: 'Telegram',
    href: 'https://t.me/slnnzmtl',
    text: '@slnnzmtl',
  },
  {
    label: 'Website',
    href: 'https://kazansky.dev',
    text: 'kazansky.dev',
  },
]

useHead({
  title: 'Kazansky Development | Software Development & AI Solutions',
  meta: [
    {
      name: 'description',
      content: 'Kazansky Development delivers web development, AI solutions, and automation systems with a strategy-first approach.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto flex max-w-5xl flex-col gap-24 px-6 py-20 lg:px-12">
      <header class="space-y-6 text-center">
        <p class="text-sm uppercase tracking-[0.35em] text-primary">
          Kazansky Development
        </p>
        <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
          Software Development &amp; AI solutions studio
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
          I help growing businesses launch and scale digital products through thoughtful strategy, precise engineering, and a relentless focus on user experience.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/survey"
            class="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Book a strategy session
          </NuxtLink>
          <a
            href="mailto:kazanskydaniel@gmail.com"
            class="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            Send an email
          </a>
        </div>
      </header>

      <section class="grid gap-8 md:grid-cols-3">
        <div class="md:col-span-1">
          <h2 class="text-2xl font-semibold">
            What I do
          </h2>
          <p class="mt-3 text-muted-foreground">
            From concept to launch, I partner with founders and teams to build tailored software that ships fast and scales smoothly.
          </p>
        </div>
        <div class="md:col-span-2 grid gap-6">
          <div
            v-for="service in services"
            :key="service.title"
            class="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 class="text-xl font-semibold text-primary">
              {{ service.title }}
            </h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ service.description }}
            </p>
          </div>
        </div>
      </section>

      <section v-if="mounted && displayedSurveys.length > 0" class="space-y-8">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-semibold">
              Project Briefs
            </h2>
            <p class="mt-3 text-muted-foreground">
              Quick questionnaires to help us understand your project needs and prepare for productive discussions.
            </p>
          </div>
          <NuxtLink
            to="/survey"
            class="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition"
          >
            View all briefs
            <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4">
              <path
                d="M7 5l6 5-6 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </NuxtLink>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="survey in displayedSurveys"
            :key="survey.slug"
            class="group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br from-background to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-5 shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-primary"
          >
            <!-- Accent Ring / Glow -->
            <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
              <div class="absolute -inset-px rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-md" />
            </div>
            <NuxtLink :to="`/survey/${survey.slug}`" class="flex flex-1 flex-col" :aria-label="`Open survey: ${survey.title}`">
              <div class="flex items-start gap-3">
                <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {{ survey.title.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-semibold leading-tight truncate">
                      {{ survey.title }}
                    </h3>
                    <span
                      v-if="submittedSlugs.has(survey.slug)"
                      class="text-nowrap inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400"
                    >
                      ✓ Отправлено
                    </span>
                    <span
                      v-else-if="savedSlugs.has(survey.slug)"
                      class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      В процессе
                    </span>
                  </div>
                  <p class="mt-1 text-muted-foreground text-xs line-clamp-2">
                    {{ survey.description }}
                  </p>
                </div>
              </div>
              <div class="mt-5 flex items-center gap-2 text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
                <span>{{ submittedSlugs.has(survey.slug) ? 'Редактировать' : savedSlugs.has(survey.slug) ? 'Продолжить' : 'Начать' }}</span>
                <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4">
                  <path
                    d="M7 5l6 5-6 5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="text-center sm:hidden">
          <NuxtLink
            to="/survey"
            class="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            View all briefs
            <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4">
              <path
                d="M7 5l6 5-6 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </NuxtLink>
        </div>
      </section>

      <section class="rounded-3xl border border-border bg-muted/50 p-10">
        <h2 class="text-2xl font-semibold">
          Why clients choose this studio
        </h2>
        <ul class="mt-6 grid gap-4 text-muted-foreground sm:grid-cols-2">
          <li
            v-for="point in highlights"
            :key="point"
            class="flex items-start gap-3"
          >
            <span class="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-primary" />
            <span>
              {{ point }}
            </span>
          </li>
        </ul>
      </section>

      <section class="grid gap-8 md:grid-cols-2">
        <div>
          <h2 class="text-2xl font-semibold">
            Let’s build something meaningful
          </h2>
          <p class="mt-3 text-muted-foreground">
            Tell me about your product, automation challenge, or AI concept. I’ll help shape the roadmap and deliver a solution that puts users and results first.
          </p>
        </div>
        <div class="rounded-3xl border border-dashed border-primary/40 bg-card p-8 shadow-sm">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-primary">
            Get in touch
          </h3>
          <ul class="mt-6 space-y-4 text-sm">
            <li
              v-for="contact in contacts"
              :key="contact.label"
              class="flex flex-col"
            >
              <span class="text-muted-foreground">
                {{ contact.label }}
              </span>
              <a :href="contact.href" class="text-base font-medium text-foreground hover:text-primary">
                {{ contact.text }}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
