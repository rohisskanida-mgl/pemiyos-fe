<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  type?: 'text' | 'password' | 'email' | 'tel' | 'number'
  placeholder?: string
  modelValue?: string | number
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: []
  blur: []
}>()

const inputClasses = computed(() => {
  const baseClasses =
    'w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-info-accent/20'

  if (props.error) {
    return `${baseClasses} border-error-accent focus:border-error-accent`
  }

  if (props.disabled) {
    return `${baseClasses} border-divider bg-light-bg text-text-dark cursor-not-allowed`
  }

  return `${baseClasses} border-divider focus:border-info-accent`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-text-dark">
      {{ label }}
      <span v-if="required" class="text-error-accent ml-1">*</span>
    </label>

    <!-- Input -->
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :class="inputClasses"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- Error Message -->
    <div v-if="error" class="text-sm text-error-accent">
      {{ error }}
    </div>

    <!-- Help Text Slot -->
    <slot name="help" />
  </div>
</template>

<style scoped>
/* Custom placeholder styling */
input::placeholder {
  color: #9ca3af; /* light gray */
  opacity: 1;
}

/* Focus state styling */
input:focus {
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* Disabled state styling */
input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>
