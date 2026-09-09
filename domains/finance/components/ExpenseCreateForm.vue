<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Label from '@/components/ui/label.vue'
import {
  todayIsoDate,
  type Category,
  type ExpenseCreateInput,
} from '../utils/finance-query'

const props = defineProps<{
  categories: Category[]
  createExpense: (input: ExpenseCreateInput) => Promise<boolean>
}>()

const open = ref(false)
const saving = ref(false)
const formError = ref<string | null>(null)

const paidDate = ref(todayIsoDate())
const name = ref('')
const category = ref('')
const amount = ref('')
const paid = ref(true)
const note = ref('')

function resetForm() {
  paidDate.value = todayIsoDate()
  name.value = ''
  category.value = props.categories[0]?.id ?? ''
  amount.value = ''
  paid.value = true
  note.value = ''
  formError.value = null
}

function openForm() {
  resetForm()
  open.value = true
}

function cancelForm() {
  open.value = false
  formError.value = null
}

watch(
  () => props.categories,
  (cats) => {
    if (open.value && !category.value && cats[0]) {
      category.value = cats[0].id
    }
  },
  { deep: true },
)

async function onSubmit() {
  if (saving.value) return
  formError.value = null
  saving.value = true
  try {
    const ok = await props.createExpense({
      paid_date: paidDate.value,
      name: name.value,
      category: category.value,
      amount: amount.value,
      paid: paid.value,
      note: note.value,
    })
    if (ok) {
      open.value = false
      resetForm()
    }
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-end">
      <Button
        v-if="!open"
        type="button"
        size="sm"
        @click="openForm"
      >
        Add expense
      </Button>
      <Button
        v-else
        type="button"
        variant="outline"
        size="sm"
        :disabled="saving"
        @click="cancelForm"
      >
        Cancel
      </Button>
    </div>

    <form
      v-if="open"
      class="rounded-md border border-border bg-muted/20 p-4 space-y-4"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="space-y-2">
          <Label for-id="expense-create-date">
            Date
          </Label>
          <Input
            id="expense-create-date"
            v-model="paidDate"
            type="date"
            required
            :disabled="saving"
          />
        </div>

        <div class="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label for-id="expense-create-name">
            Name
          </Label>
          <Input
            id="expense-create-name"
            v-model="name"
            type="text"
            required
            placeholder="Expense name"
            :disabled="saving"
          />
        </div>

        <div class="space-y-2">
          <Label for-id="expense-create-category">
            Category
          </Label>
          <select
            id="expense-create-category"
            v-model="category"
            required
            :disabled="saving || categories.length === 0"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option
              v-if="categories.length === 0"
              value=""
              disabled
            >
              No categories
            </option>
            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <Label for-id="expense-create-amount">
            Amount
          </Label>
          <Input
            id="expense-create-amount"
            v-model="amount"
            type="number"
            min="0"
            step="1"
            required
            placeholder="0"
            :disabled="saving"
          />
        </div>

        <div class="space-y-2">
          <Label for-id="expense-create-paid">
            Paid
          </Label>
          <select
            id="expense-create-paid"
            v-model="paid"
            :disabled="saving"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option :value="true">
              Paid
            </option>
            <option :value="false">
              Unpaid
            </option>
          </select>
        </div>

        <div class="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label for-id="expense-create-note">
            Note
          </Label>
          <Input
            id="expense-create-note"
            v-model="note"
            type="text"
            placeholder="Optional"
            :disabled="saving"
          />
        </div>
      </div>

      <p
        v-if="formError"
        class="text-sm text-destructive"
      >
        {{ formError }}
      </p>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="saving"
          @click="cancelForm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          :disabled="saving || categories.length === 0"
        >
          {{ saving ? 'Saving…' : 'Save expense' }}
        </Button>
      </div>
    </form>
  </div>
</template>
