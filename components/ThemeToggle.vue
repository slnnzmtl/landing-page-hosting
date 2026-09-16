<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import Button from '~/components/ui/button.vue'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <Button
      variant="outline"
      size="sm"
      :aria-label="colorMode.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="toggleTheme"
    >
      <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4" aria-hidden="true" />
      <Moon v-else class="h-4 w-4" aria-hidden="true" />
      <span class="sr-only">
        {{ colorMode.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme' }}
      </span>
    </Button>
    <template #fallback>
      <Button
        variant="outline"
        size="sm"
        aria-label="Loading theme toggle"
        disabled
      >
        <Moon class="h-4 w-4" aria-hidden="true" />
      </Button>
    </template>
  </ClientOnly>
</template>
