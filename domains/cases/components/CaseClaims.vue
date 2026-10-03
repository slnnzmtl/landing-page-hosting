<script setup lang="ts">
import { computed } from 'vue'
import type { CaseClaim, CaseLink } from '../data/types'
import { caseBodyText, caseSecondaryCta, caseStackTag } from '../utils/case-ui'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { homepageHrefKind, opensInNewTab } from '~/data/homepage'

const props = defineProps<{
  heading: string
  claims: CaseClaim[]
  links?: CaseLink[]
  stackTags?: string[]
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()

const claims = computed(() => props.claims
  .map(claim => ({ ...claim, publicWording: claim.publicWording.trim() }))
  .filter(claim => Boolean(claim.publicWording)))

const links = computed(() => props.links?.filter(link => link.label.trim() && link.href) || [])

function isRepositoryLink(link: CaseLink): boolean {
  return /repository|github\.com/i.test(`${link.label} ${link.href}`)
}

const repositoryLinks = computed(() => links.value.filter(isRepositoryLink))
const resourceLinks = computed(() => links.value.filter(link => !isRepositoryLink(link)))

const show = computed(() =>
  Boolean(claims.value.length || links.value.length || props.stackTags?.length),
)
</script>

<template>
  <section
    v-if="show"
    aria-labelledby="case-claims-heading"
    class="space-y-5"
  >
    <h2
      id="case-claims-heading"
      class="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
    >
      {{ heading }}
    </h2>

    <div
      v-if="claims.length"
      class="max-w-[70ch] space-y-3"
    >
      <p
        v-for="claim in claims"
        :key="claim.id"
        :class="caseBodyText"
      >
        {{ claim.publicWording }}
      </p>
    </div>

    <div
      v-if="stackTags?.length || resourceLinks.length"
      class="space-y-3 border-t border-border/50 pt-5"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-primary">
        Resources
      </p>
      <ul
        class="flex flex-wrap gap-2"
        aria-label="Case resources"
      >
        <li
          v-for="tag in stackTags"
          :key="`stack-${tag}`"
          :class="caseStackTag"
        >
          {{ tag }}
        </li>
        <li
          v-for="link in resourceLinks"
          :key="link.href"
        >
          <a
            v-if="homepageHrefKind(link.href) === 'native'"
            :href="link.href"
            v-bind="outboundAttrs(link.href)"
            :class="[caseStackTag, linkFocus]"
          >
            {{ link.label }}
            <span
              v-if="opensInNewTab(link.href)"
              class="sr-only"
            >(opens in a new tab)</span>
          </a>
          <NuxtLink
            v-else
            :to="link.href"
            :class="[caseStackTag, linkFocus]"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div
      v-if="repositoryLinks.length"
      class="border-t border-border/50 pt-5"
    >
      <ul
        class="flex flex-wrap gap-2"
        aria-label="Case repository links"
      >
        <li
          v-for="link in repositoryLinks"
          :key="link.href"
        >
          <a
            v-if="homepageHrefKind(link.href) === 'native'"
            :href="link.href"
            v-bind="outboundAttrs(link.href)"
            :class="[caseSecondaryCta, linkFocus]"
          >
            {{ link.label }}
            <span
              v-if="opensInNewTab(link.href)"
              class="sr-only"
            >(opens in a new tab)</span>
          </a>
          <NuxtLink
            v-else
            :to="link.href"
            :class="[caseSecondaryCta, linkFocus]"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
