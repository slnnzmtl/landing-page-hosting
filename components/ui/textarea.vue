<script setup lang="ts">
const props = defineProps<{ modelValue?: string, placeholder?: string, required?: boolean, rows?: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string | undefined): void }>()
</script>

<template>
  <textarea
    :rows="props.rows || 4"
    :placeholder="props.placeholder"
    :required="props.required"
    :value="props.modelValue"
    class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
