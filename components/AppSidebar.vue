<script setup lang="ts">
import { opensInNewTab } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { isNavItemActive } from '~/utils/app-link'
import { pageHash, scrollHomeToTop } from '~/utils/silent-hash'

const router = useRouter()
const { linkFocus, outboundAttrs } = useHomepageUi()
const { data: portfolio } = await usePortfolio()

const routePath = computed(() => router.currentRoute.value.path)
const routeHash = computed(() => router.currentRoute.value.hash)

function syncHash() {
  if (import.meta.client) {
    pageHash.value = window.location.hash
  }
}
watch(routePath, () => {
  closeMenu()
  burgerHiddenByScroll.value = false
  if (import.meta.client) lastScrollY = window.scrollY
})
watch(routeHash, (hash) => {
  if (import.meta.client && !hash && window.location.hash) return
  pageHash.value = hash
})

const currentHash = computed(() => pageHash.value)

const navItems = computed(() =>
  (portfolio.value?.homepage.navItems || []).map(item => ({
    label: item.label,
    to: item.href,
  })),
)

type NavItem = { label: string, to: string }

const menuOpen = ref(false)
const burgerHiddenByScroll = ref(false)
const burgerRevealed = computed(() => menuOpen.value || !burgerHiddenByScroll.value)
const menuId = 'site-nav-panel'
const hideOnScrollDelta = 8
const revealNearTopPx = 24

let lastScrollY = 0
let scrollTicking = false

function syncBurgerVisibility() {
  if (!import.meta.client) return
  const y = window.scrollY
  const delta = y - lastScrollY
  lastScrollY = y

  if (y <= revealNearTopPx) {
    burgerHiddenByScroll.value = false
    return
  }

  if (delta > hideOnScrollDelta) burgerHiddenByScroll.value = true
  else if (delta < -hideOnScrollDelta) burgerHiddenByScroll.value = false
}

function onScroll() {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(() => {
    syncBurgerVisibility()
    scrollTicking = false
  })
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onNavClick(item: NavItem) {
  closeMenu()
  if (item.to !== '/' || routePath.value !== '/' || !import.meta.client) return
  scrollHomeToTop()
}

watch(menuOpen, (open) => {
  if (!import.meta.client) return
  if (open) document.body.style.overflow = 'hidden'
})

function onMenuAfterLeave() {
  if (!import.meta.client) return
  document.body.style.overflow = ''
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  syncHash()
  lastScrollY = window.scrollY
  window.addEventListener('hashchange', syncHash)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('hashchange', syncHash)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})

const sidebarLinkFocus = [linkFocus, 'focus-visible:ring-offset-background'].join(' ')

function isActive(item: NavItem) {
  if (opensInNewTab(item.to)) return false
  return isNavItemActive(item.to, routePath.value, currentHash.value)
}

const linkBase
  = 'rounded-xl px-3 py-2 text-sm font-medium transition-colors'

function linkClass(item: NavItem) {
  return [
    linkBase,
    sidebarLinkFocus,
    isActive(item)
      ? 'text-xl md:text-sm md:bg-card md:border border-border text-foreground'
      : 'text-muted-foreground md:hover:bg-card hover:text-foreground',
  ]
}
</script>

<template>
  <!-- Mobile and tablet: burger + overlay panel (contents: do not occupy a grid track) -->
  <div class="contents xl:hidden">
    <button
      type="button"
      class="fixed bottom-8 left-1/2 z-50 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-border/60 bg-black/40 text-foreground shadow-lg backdrop-blur-sm transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="[
        sidebarLinkFocus,
        burgerRevealed ? '' : 'translate-y-24 opacity-0 pointer-events-none',
      ]"
      :aria-expanded="menuOpen"
      :aria-controls="menuId"
      :aria-hidden="burgerRevealed ? undefined : 'true'"
      :tabindex="burgerRevealed ? undefined : -1"
      :aria-label="menuOpen ? 'Close site navigation' : 'Open site navigation'"
      @click="toggleMenu"
    >
      <span
        class="relative block h-5 w-5"
        aria-hidden="true"
      >
        <span
          class="absolute left-0.5 top-[5px] h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          :class="menuOpen ? 'translate-y-[5px] rotate-45' : ''"
        />
        <span
          class="absolute left-0.5 top-[9.5px] h-0.5 w-4 rounded-full bg-current transition-opacity duration-200"
          :class="menuOpen ? 'opacity-0' : ''"
        />
        <span
          class="absolute left-0.5 top-[14px] h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          :class="menuOpen ? '-translate-y-[5px] -rotate-45' : ''"
        />
      </span>
    </button>

    <Teleport to="body">
      <Transition
        name="nav-menu"
        @after-leave="onMenuAfterLeave"
      >
        <nav
          v-if="menuOpen"
          :id="menuId"
          class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-black/50 px-6 backdrop-blur-xl xl:hidden"
          aria-label="Site"
        >
          <template
            v-for="item in navItems"
            :key="item.to"
          >
            <a
              v-if="opensInNewTab(item.to)"
              :href="item.to"
              v-bind="outboundAttrs(item.to)"
              class="w-full max-w-xs text-right text-lg"
              :class="linkClass(item)"
              @click="closeMenu"
            >
              {{ item.label }}
            </a>
            <NuxtLink
              v-else
              :to="item.to"
              class="w-full max-w-xs text-right text-lg"
              :class="linkClass(item)"
              :aria-current="isActive(item) ? 'page' : undefined"
              @click="onNavClick(item)"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>
      </Transition>
    </Teleport>
  </div>

  <!-- Desktop: reserved left column at xl -->
  <aside
    class="hidden bg-transparent xl:sticky xl:top-0 xl:z-40 xl:col-start-1 xl:row-start-1 xl:block xl:h-screen xl:self-start"
    aria-label="Site navigation"
  >
    <nav
      class="flex h-full flex-col gap-1 px-4 py-8"
      aria-label="Site"
    >
      <template
        v-for="item in navItems"
        :key="item.to"
      >
        <a
          v-if="opensInNewTab(item.to)"
          :href="item.to"
          v-bind="outboundAttrs(item.to)"
          :class="linkClass(item)"
        >
          {{ item.label }}
        </a>
        <NuxtLink
          v-else
          :to="item.to"
          :class="linkClass(item)"
          :aria-current="isActive(item) ? 'page' : undefined"
          @click="onNavClick(item)"
        >
          {{ item.label }}
        </NuxtLink>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.nav-menu-enter-active {
  transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-menu-leave-active {
  transition: opacity 220ms ease-in;
}

.nav-menu-enter-from,
.nav-menu-leave-to {
  opacity: 0;
}
</style>
