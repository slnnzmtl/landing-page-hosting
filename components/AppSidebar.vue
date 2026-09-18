<script setup lang="ts">
const route = useRoute()

/** Route hash can lag behind location.hash on hash-only navigations. */
const liveHash = ref('')
function syncHash() {
  if (import.meta.client) {
    liveHash.value = window.location.hash
  }
}
watch(() => route.fullPath, () => {
  syncHash()
  closeMenu()
})

const currentHash = computed(() => route.hash || liveHash.value)

const navItems = [
  { label: 'Homepage', to: '/' },
  { label: 'Experience', to: '/experience' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contacts', to: '/#contact' },
]

const menuOpen = ref(false)
const menuId = 'site-nav-panel'

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onNavClick(item: (typeof navItems)[number]) {
  closeMenu()
  // Same-route `/` does not run scrollBehavior; still jump to top.
  if (item.to !== '/' || route.path !== '/' || !import.meta.client) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(menuOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  syncHash()
  window.addEventListener('hashchange', syncHash)
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('hashchange', syncHash)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const linkFocus
  = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function isActive(item: (typeof navItems)[number]) {
  if (item.to === '/#contact') {
    return route.path === '/' && currentHash.value === '#contact'
  }
  if (item.to === '/') {
    return route.path === '/' && currentHash.value !== '#contact'
  }
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

const linkBase
  = 'rounded-md px-3 py-2 text-sm font-medium transition-colors'

function linkClass(item: (typeof navItems)[number]) {
  return [
    linkBase,
    linkFocus,
    isActive(item)
      ? 'bg-muted text-foreground'
      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
  ]
}
</script>

<template>
  <!-- Mobile: burger + overlay panel -->
  <div class="md:hidden">
    <button
      type="button"
      class="fixed right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md bg-black/30 text-foreground backdrop-blur-sm"
      :class="linkFocus"
      :aria-expanded="menuOpen"
      :aria-controls="menuId"
      :aria-label="menuOpen ? 'Close site navigation' : 'Open site navigation'"
      @click="toggleMenu"
    >
      <svg
        v-if="!menuOpen"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
      <svg
        v-else
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>

    <Teleport to="body">
      <nav
        v-if="menuOpen"
        :id="menuId"
        class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-black/50 px-6 backdrop-blur-xl md:hidden"
        aria-label="Site"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['w-full max-w-xs text-center text-lg', ...linkClass(item)]"
          :aria-current="isActive(item) ? 'page' : undefined"
          @click="onNavClick(item)"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </Teleport>
  </div>

  <!-- Desktop: left rail -->
  <aside
    class="hidden bg-transparent md:sticky md:top-0 md:z-40 md:col-start-1 md:row-start-1 md:block md:h-screen md:w-52 md:self-start"
    aria-label="Site navigation"
  >
    <nav
      class="flex h-full flex-col gap-1 px-4 py-8"
      aria-label="Site"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="linkClass(item)"
        :aria-current="isActive(item) ? 'page' : undefined"
        @click="onNavClick(item)"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>
