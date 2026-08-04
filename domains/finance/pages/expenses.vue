<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import {
  useFinanceExpenses,
} from '../composables/useFinanceExpenses'
import {
  formatUsd,
  type ExpenseSortColumn,
  type PaidFilter,
} from '../utils/finance-query'

useHead({
  title: 'Finance Expenses',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const {
  rows,
  categories,
  loading,
  error,
  accessHint,
  year,
  month,
  dateFrom,
  dateTo,
  selectedCategoryIds,
  paidFilter,
  filterQuery,
  page,
  pageSize,
  sortBy,
  sortDir,
  totalPages,
  totalAmount,
  pageRangeLabel,
  availableYears,
  clearDateRange,
  toggleCategory,
  clearCategoryFilter,
  isCategorySelected,
  toggleSort,
  goToPrevPage,
  goToNextPage,
} = useFinanceExpenses()

const monthOptions = [
  { value: 0, label: 'All months' },
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const paidOptions: { value: PaidFilter, label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
]

const pageSizeOptions = [25, 50, 100]

const selectClass
  = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

function formatPaidDate(value: string) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function ariaSortFor(column: ExpenseSortColumn): 'ascending' | 'descending' | 'none' {
  if (sortBy.value !== column) return 'none'
  return sortDir.value === 'asc' ? 'ascending' : 'descending'
}

function sortIndicator(column: ExpenseSortColumn): string {
  if (sortBy.value !== column) return ''
  return sortDir.value === 'asc' ? ' ↑' : ' ↓'
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-4 space-y-8">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          Expenses
        </h1>
        <p class="text-muted-foreground mt-2 max-w-prose">
          Paginated expense list with category, date, and paid-status filters.
        </p>
      </div>
      <NuxtLink
        :to="{ path: '/finance/dashboard', query: filterQuery }"
        class="text-sm text-primary hover:underline"
      >
        ← Back to dashboard
      </NuxtLink>
    </header>

    <!-- Filters -->
    <section class="space-y-4 border-b border-border pb-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="expenses-filter-year">Year</label>
          <select
            id="expenses-filter-year"
            v-model.number="year"
            :class="selectClass"
          >
            <option
              v-for="y in availableYears"
              :key="y"
              :value="y"
            >
              {{ y }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="expenses-filter-month">Month</label>
          <select
            id="expenses-filter-month"
            v-model.number="month"
            :class="selectClass"
            :disabled="!!(dateFrom || dateTo)"
          >
            <option
              v-for="m in monthOptions"
              :key="m.value"
              :value="m.value"
            >
              {{ m.label }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="expenses-filter-from">From</label>
          <Input
            id="expenses-filter-from"
            v-model="dateFrom"
            type="date"
          />
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium" for="expenses-filter-to">To</label>
            <button
              v-if="dateFrom || dateTo"
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearDateRange"
            >
              Clear range
            </button>
          </div>
          <Input
            id="expenses-filter-to"
            v-model="dateTo"
            type="date"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-2 flex-1">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-medium">Categories</span>
            <button
              v-if="selectedCategoryIds.length"
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearCategoryFilter"
            >
              Clear
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="rounded-md border px-3 py-1.5 text-sm transition-colors"
              :class="isCategorySelected(cat.id)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input bg-background hover:bg-accent'"
              @click="toggleCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
            <p
              v-if="!categories.length && !loading"
              class="text-sm text-muted-foreground"
            >
              No categories loaded.
            </p>
          </div>
        </div>

        <div class="space-y-2 space-x-2">
          <span class="text-sm font-medium">Status</span>
          <div class="inline-flex rounded-md border border-input overflow-hidden">
            <button
              v-for="opt in paidOptions"
              :key="opt.value"
              type="button"
              class="px-3 py-2 text-sm transition-colors"
              :class="paidFilter === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent'"
              @click="paidFilter = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading / error -->
    <div v-if="loading" class="text-muted-foreground text-sm">
      Loading expenses…
    </div>
    <div
      v-else-if="error"
      class="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      {{ error }}
    </div>
    <div
      v-else-if="accessHint"
      class="rounded-md border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
    >
      {{ accessHint }}
    </div>

    <template v-else>
      <p
        v-if="!rows.length"
        class="text-sm text-muted-foreground"
      >
        No expenses match the current filters.
      </p>

      <template v-else>
        <div class="overflow-x-auto rounded-md border border-border">
          <table class="w-full min-w-[640px] text-sm">
            <thead class="border-b border-border bg-muted/40">
              <tr class="text-left">
                <th
                  class="px-4 py-3 font-medium"
                  :aria-sort="ariaSortFor('paid_date')"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    @click="toggleSort('paid_date')"
                  >
                    Date{{ sortIndicator('paid_date') }}
                  </button>
                </th>
                <th
                  class="px-4 py-3 font-medium"
                  :aria-sort="ariaSortFor('name')"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    @click="toggleSort('name')"
                  >
                    Name{{ sortIndicator('name') }}
                  </button>
                </th>
                <th class="px-4 py-3 font-medium">
                  Category
                </th>
                <th
                  class="px-4 py-3 font-medium text-right"
                  :aria-sort="ariaSortFor('amount')"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    @click="toggleSort('amount')"
                  >
                    Amount{{ sortIndicator('amount') }}
                  </button>
                </th>
                <th
                  class="px-4 py-3 font-medium"
                  :aria-sort="ariaSortFor('paid')"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    @click="toggleSort('paid')"
                  >
                    Paid{{ sortIndicator('paid') }}
                  </button>
                </th>
                <th class="px-4 py-3 font-medium">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in rows"
                :key="row.id"
                class="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td class="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {{ formatPaidDate(row.paid_date) }}
                </td>
                <td class="px-4 py-3 font-medium">
                  {{ row.name }}
                </td>
                <td class="px-4 py-3">
                  {{ row.categoryName }}
                </td>
                <td class="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                  {{ formatUsd(row.amount) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="row.paid
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-muted text-muted-foreground'"
                  >
                    {{ row.paid ? 'Paid' : 'Unpaid' }}
                  </span>
                </td>
                <td
                  class="px-4 py-3 max-w-[12rem] truncate text-muted-foreground"
                  :title="row.note || undefined"
                >
                  {{ row.note || '—' }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-border bg-muted/40 font-semibold">
                <td colspan="3" class="px-4 py-3">
                  Total
                </td>
                <td class="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                  {{ formatUsd(totalAmount) }}
                </td>
                <td colspan="2" class="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-muted-foreground">
            {{ pageRangeLabel }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <label class="text-sm text-muted-foreground" for="expenses-page-size">
                Per page
              </label>
              <select
                id="expenses-page-size"
                v-model.number="pageSize"
                class="flex h-10 w-16 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option
                  v-for="size in pageSizeOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>

            <span class="text-sm text-muted-foreground">
              Page {{ page }} of {{ totalPages }}
            </span>

            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="page <= 1"
                @click="goToPrevPage"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                :disabled="page >= totalPages"
                @click="goToNextPage"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
