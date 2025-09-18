<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps<{ modelValue?: string; options: { label: string; value: string }[]; name?: string }>();
const emit = defineEmits<{ (e:'update:modelValue', v:string):void }>();
const internal = ref(props.modelValue || '');
watch(() => props.modelValue, v => { if (v !== internal.value) internal.value = v || ''; });
watch(internal, v => emit('update:modelValue', v));
</script>
<template>
  <div class="space-y-2">
    <div v-for="opt in props.options" :key="opt.value" class="flex items-center space-x-2">
      <input :id="`${props.name}-${opt.value}`" type="radio" :name="props.name" :value="opt.value" v-model="internal" class="h-4 w-4 border border-input text-primary focus:ring-ring" />
      <label :for="`${props.name}-${opt.value}`" class="text-sm leading-none cursor-pointer">{{ opt.label }}</label>
    </div>
  </div>
</template>
