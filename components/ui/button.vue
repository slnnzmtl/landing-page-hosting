<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'arrow', size?: 'sm' | 'md' | 'lg', type?: string, disabled?: boolean, as?: 'button' | 'span' }>()
const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()
const variant = computed(() => props.variant || 'default')
const size = computed(() => props.size || 'md')
const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    arrow: 'gap-1.5 rounded-none bg-transparent p-0 text-sm text-primary hover:text-primary/80',
  }
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
  }
  return [base, variants[variant.value], variant.value === 'arrow' ? undefined : sizes[size.value]].filter(Boolean).join(' ')
})
</script>

<template>
  <component
    :is="props.as || 'button'"
    :type="props.as === 'span' ? undefined : (props.type || 'button')"
    :disabled="props.disabled"
    :class="classes"
    @click="(e) => emit('click', e)"
  >
    <slot />
    <svg
      v-if="variant === 'arrow'"
      viewBox="0 0 20 20"
      fill="none"
      class="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 10h11m-5-5 5 5-5 5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </component>
</template>
