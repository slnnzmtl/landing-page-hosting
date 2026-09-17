<script setup lang="ts">
import { publishedHomepage } from '~/data/homepage'
import { useHomepageHead } from '~/composables/useHomepageHead'

const home = publishedHomepage()
useHomepageHead(home)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to main content
    </a>

    <div
      id="main-content"
      class="mx-auto flex max-w-5xl flex-col gap-12 md:gap-24 px-6 py-20 lg:px-12"
      tabindex="-1"
    >
      <HomeHero
        :person="home.person"
        :value-proposition="home.valueProposition"
        :workflow="home.workflow"
        :primary-ctas="home.primaryCtas"
        :profile-links="home.profileLinks"
      />

      <section
        aria-labelledby="proof-heading"
        class="rounded-2xl border border-border bg-muted/50 p-4 sm:rounded-3xl sm:p-8"
      >
        <h2
          id="proof-heading"
          class="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm"
        >
          Approved facts
        </h2>
        <ul class="mt-4 flex flex-row flex-wrap gap-x-3 gap-y-4 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <li
            v-for="item in home.proof"
            :key="`${item.value}-${item.label}`"
            class="min-w-0 basis-[calc(50%-0.375rem)] sm:basis-auto"
          >
            <p class="text-lg font-semibold leading-tight sm:text-3xl">
              {{ item.value }}
            </p>
            <p class="mt-1 text-xs leading-snug text-muted-foreground sm:mt-2 sm:text-sm">
              {{ item.label }}
            </p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="tracks-heading">
        <h2
          id="tracks-heading"
          class="text-2xl font-semibold"
        >
          Three tracks of work
        </h2>
        <p class="mt-3 max-w-2xl text-muted-foreground">
          {{ home.tracksIntro.text }}
        </p>
        <ul class="mt-8 grid gap-5 md:grid-cols-3">
          <HomeColumnCard
            v-for="track in home.tracks"
            :key="track.id"
            :title="track.title"
            :summary="track.summary"
          />
        </ul>
      </section>

      <HomeSelectedWork
        :intro="home.selectedWorkIntro"
        :sections="home.workSections"
      />

      <section aria-labelledby="capabilities-heading">
        <h2
          id="capabilities-heading"
          class="text-2xl font-semibold"
        >
          Capabilities
        </h2>
        <ul class="mt-8 grid gap-5 md:grid-cols-3">
          <HomeColumnCard
            v-for="capability in home.capabilities"
            :key="capability.title"
            :title="capability.title"
            :summary="capability.summary"
          />
        </ul>
      </section>

      <HomeContact
        :contact="home.contact"
        :profile-links="home.profileLinks"
      />
    </div>
  </div>
</template>
