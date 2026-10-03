<script setup lang="ts">
import { onMounted } from 'vue'

const destination = '/products/rekordbox-playlist-converter'

useHead({
  title: 'Redirecting to Rekordbox Playlist Converter',
})

onMounted(() => {
  void navigateTo(destination)
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-6 py-16 text-center text-foreground">
    <p class="text-sm text-muted-foreground">
      Redirecting to
      <AppLink
        :href="destination"
        class="font-medium text-primary underline-offset-4 hover:underline"
      >
        Rekordbox Playlist Converter
      </AppLink>
      …
    </p>
  </main>
</template>
