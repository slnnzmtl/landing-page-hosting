<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { CaseSection } from '../data/types'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = defineProps<{
  sections: CaseSection[]
}>()

const route = useRoute()
const { linkFocus } = useHomepageUi()
const menuOpen = ref(false)
const buttonEl = ref<HTMLButtonElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const previousOverflow = ref('')

function focusableElements(): HTMLElement[] {
  if (!panelEl.value) return []
  return [...panelEl.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
}

function closeMenu(restoreFocus = true) {
  menuOpen.value = false
  if (import.meta.client) {
    document.body.style.overflow = previousOverflow.value
  }
  if (restoreFocus) buttonEl.value?.focus()
}

async function openMenu() {
  menuOpen.value = true
  if (import.meta.client) {
    previousOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  await nextTick()
  focusableElements()[0]?.focus()
}

function toggleMenu() {
  if (menuOpen.value) closeMenu()
  else void openMenu()
}

function scrollToSection(event: MouseEvent, anchor: string) {
  event.preventDefault()
  const target = document.getElementById(anchor)
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${anchor}`)
  closeMenu()
}

function onKeydown(event: KeyboardEvent) {
  if (!menuOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }
  if (event.key !== 'Tab') return
  const nodes = focusableElements()
  if (!nodes.length) return
  const first = nodes[0]!
  const last = nodes[nodes.length - 1]!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => route.path, () => closeMenu(false))

watch(menuOpen, (open) => {
  if (!import.meta.client) return
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = previousOverflow.value
})
</script>

<template>
  <div class="w-full border-b border-border/70 bg-black/90 px-5 py-3 backdrop-blur-md sm:px-8">
    <button
      ref="buttonEl"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="case-mobile-menu"
      :class="[
        'flex w-full items-center justify-between gap-4 text-left text-sm font-medium text-foreground',
        linkFocus,
      ]"
      @click="toggleMenu"
    >
      <span>On this case</span>
      <span aria-hidden="true">{{ menuOpen ? '−' : '+' }}</span>
    </button>

    <nav
      v-if="menuOpen"
      id="case-mobile-menu"
      ref="panelEl"
      aria-label="Case sections"
      class="pt-3"
    >
      <ul class="grid gap-1 sm:grid-cols-2">
        <li
          v-for="section in props.sections"
          :key="section.id"
        >
          <a
            :href="`#${section.anchor}`"
            :class="[
              'block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-card hover:text-foreground',
              linkFocus,
            ]"
            @click="scrollToSection($event, section.anchor)"
          >
            {{ section.eyebrow || section.heading }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
