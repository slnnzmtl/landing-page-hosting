import { ref, computed, reactive, readonly, nextTick } from 'vue'
import { z } from 'zod'

// Types for form configuration
export interface FormField {
  id: string
  label?: string
  type: 'text' | 'email' | 'textarea' | 'radio' | 'checkbox' | 'number' | 'tel' | 'url'
  required?: boolean
  placeholder?: string
  options?: { label: string, value: string }[] // For radio/checkbox fields
  validation?: z.ZodSchema // Custom Zod validation schema
}

export interface FormConfig<TResponse = unknown> {
  webhookUrl: string
  fields: FormField[]
  method?: 'POST' | 'PUT' | 'PATCH'
  headers?: Record<string, string>
  transformPayload?: (data: Record<string, unknown>) => Record<string, unknown>
  onSuccess?: (response: TResponse, data: Record<string, unknown>) => void
  onError?: (error: Error, data: Record<string, unknown>) => void
}

export interface FormState<TResponse = unknown> {
  isSubmitting: boolean
  isSubmitted: boolean
  error: string | null
  response: TResponse | null
}

export const useForm = <TResponse = unknown>(config: FormConfig<TResponse>) => {
  // Form data reactive object
  const formData = reactive<Record<string, unknown>>({})

  // Initialize form data with empty values based on field types
  config.fields.forEach((field) => {
    if (field.type === 'checkbox') {
      formData[field.id] = []
    }
    else {
      formData[field.id] = ''
    }
  })

  // Form state
  const state = reactive<FormState<TResponse>>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    response: null,
  })

  // Validation errors
  const errors = ref<Record<string, string | undefined>>({})

  // Validate individual field
  const validateField = (fieldId: string): boolean => {
    const field = config.fields.find(f => f.id === fieldId)
    if (!field) return true

    const value = formData[fieldId]

    // Required field validation
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      errors.value[fieldId] = `${field.label || fieldId} is required`
      return false
    }

    // Custom Zod validation
    if (field.validation) {
      try {
        field.validation.parse(value)
        errors.value[fieldId] = undefined
        return true
      }
      catch (error) {
        if (error instanceof z.ZodError) {
          errors.value[fieldId] = error.issues[0]?.message || 'Invalid value'
        }
        return false
      }
    }

    // Built-in type validation
    if (value && typeof value === 'string') {
      switch (field.type) {
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/u
          if (!emailRegex.test(value)) {
            errors.value[fieldId] = 'Please enter a valid email address'
            return false
          }
          break
        }
        case 'url': {
          try {
            new URL(value)
          }
          catch {
            errors.value[fieldId] = 'Please enter a valid URL'
            return false
          }
          break
        }
        case 'tel': {
          const phoneRegex = /^\+?[1-9]\d{0,15}$/
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            errors.value[fieldId] = 'Please enter a valid phone number'
            return false
          }
          break
        }
      }
    }

    errors.value[fieldId] = undefined
    return true
  }

  // Validate all fields
  const validateForm = (): boolean => {
    let isValid = true
    config.fields.forEach((field) => {
      if (!validateField(field.id)) {
        isValid = false
      }
    })
    return isValid
  }

  // Check if form is valid
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
      && config.fields.every((field) => {
        if (!field.required) return true
        const value = formData[field.id]
        return value && (Array.isArray(value) ? value.length > 0 : true)
      })
  })

  // Check if form has been touched/modified
  const isDirty = computed(() => {
    return config.fields.some((field) => {
      const value = formData[field.id]
      if (field.type === 'checkbox') {
        return Array.isArray(value) && value.length > 0
      }
      return value !== ''
    })
  })

  // Reset form to initial state
  const reset = () => {
    config.fields.forEach((field) => {
      if (field.type === 'checkbox') {
        formData[field.id] = []
      }
      else {
        formData[field.id] = ''
      }
    })

    errors.value = {}
    state.isSubmitting = false
    state.isSubmitted = false
    state.error = null
    state.response = null
  }

  // Set form data programmatically
  const setFieldValue = (fieldId: string, value: unknown) => {
    formData[fieldId] = value
    // Validate field after setting value
    nextTick(() => {
      validateField(fieldId)
    })
  }

  // Set multiple field values at once
  const setFormData = (data: Record<string, unknown>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        formData[key] = value
      }
    })

    // Validate all fields after setting data
    nextTick(() => {
      validateForm()
    })
  }

  // Submit form
  const submit = async () => {
    if (state.isSubmitting) return

    // Validate form before submission
    if (!validateForm()) {
      state.error = 'Please fix the validation errors before submitting'
      return
    }

    state.isSubmitting = true
    state.error = null

    try {
      // Prepare payload
      let payload = { ...formData }

      // Apply custom transformation if provided
      if (config.transformPayload) {
        payload = config.transformPayload(payload)
      }

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...config.headers,
      }

      // Make the request
      const response = await fetch(config.webhookUrl, {
        method: config.method || 'POST',
        mode: 'cors',
        headers,
        body: JSON.stringify(payload),
      })

      // Handle response
      let responseData = null
      try {
        responseData = await response.json()
      }
      catch {
        // Response might not be JSON, that's ok
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message
          || responseData?.error
          || `Request failed with status ${response.status}`,
        )
      }

      // Success
      state.response = responseData
      state.isSubmitted = true

      // Call success callback if provided
      if (config.onSuccess) {
        config.onSuccess(responseData, payload)
      }

      return responseData
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the form'
      state.error = errorMessage

      // Call error callback if provided
      if (config.onError) {
        config.onError(error as Error, formData)
      }

      throw error
    }
    finally {
      state.isSubmitting = false
    }
  }

  return {
    // Form data
    formData: readonly(formData),

    // Form state
    state: readonly(state),
    errors: readonly(errors),

    // Computed properties
    isValid,
    isDirty,

    // Methods
    validateField,
    validateForm,
    setFieldValue,
    setFormData,
    reset,
    submit,
  }
}

// Helper function to create common form field configurations
export const createFormField = (
  id: string,
  type: FormField['type'],
  options: Partial<Omit<FormField, 'id' | 'type'>> = {},
): FormField => ({
  id,
  type,
  label: options.label || id,
  required: options.required || false,
  placeholder: options.placeholder,
  options: options.options,
  validation: options.validation,
})

// Predefined validation schemas for common use cases
export const formValidations = {
  email: z.string().email('Please enter a valid email address'),
  required: z.string().min(1, 'This field is required'),
  minLength: (min: number) => z.string().min(min, `Must be at least ${min} characters`),
  maxLength: (max: number) => z.string().max(max, `Must be no more than ${max} characters`),
  phone: z.string().regex(/^\+?[1-9]\d{0,15}$/, 'Please enter a valid phone number'),
  url: z.string().url('Please enter a valid URL'),
  number: z.number().or(z.string().transform(val => Number(val))),
  positiveNumber: z.number().positive('Must be a positive number').or(z.string().transform(val => Number(val))),
}
