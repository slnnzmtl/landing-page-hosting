<script setup lang="ts">
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
