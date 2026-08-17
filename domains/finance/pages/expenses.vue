<script setup lang="ts">
import { useFinanceExpenses } from '../composables/useFinanceExpenses'
import ExpenseTable from '../components/ExpenseTable.vue'
import FinanceFilterBar from '../components/FinanceFilterBar.vue'

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
  updateExpense,
} = useFinanceExpenses()
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

    <FinanceFilterBar
      v-model:year="year"
      v-model:month="month"
      v-model:date-from="dateFrom"
      v-model:date-to="dateTo"
      v-model:paid-filter="paidFilter"
      id-prefix="expenses"
      :loading="loading"
      :available-years="availableYears"
      :categories="categories"
      :selected-category-ids="selectedCategoryIds"
      :is-category-selected="isCategorySelected"
      :clear-date-range="clearDateRange"
      :toggle-category="toggleCategory"
      :clear-category-filter="clearCategoryFilter"
    />

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

    <p
      v-else-if="!rows.length"
      class="text-sm text-muted-foreground"
    >
      No expenses match the current filters.
    </p>

    <ExpenseTable
      v-else
      v-model:page-size="pageSize"
      :rows="rows"
      :categories="categories"
      :total-amount="totalAmount"
      :sort-by="sortBy"
      :sort-dir="sortDir"
      :page="page"
      :total-pages="totalPages"
      :page-range-label="pageRangeLabel"
      :update-expense="updateExpense"
      :toggle-sort="toggleSort"
      :go-to-prev-page="goToPrevPage"
      :go-to-next-page="goToNextPage"
    />
  </div>
</template>
