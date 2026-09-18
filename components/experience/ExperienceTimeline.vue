<script setup lang="ts">
import type { ExperienceRole } from '~/data/experience'

defineProps<{
  roles: ExperienceRole[]
}>()
</script>

<template>
  <ol class="relative space-y-10">
    <span
      aria-hidden="true"
      class="pointer-events-none absolute bottom-3 left-[9px] top-3 w-px bg-border"
    />
    <li
      v-for="role in roles"
      :key="role.id"
      class="relative"
    >
      <ExperienceRoleCard :role="role" />
    </li>
  </ol>
</template>
