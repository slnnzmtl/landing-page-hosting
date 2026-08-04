<script setup lang="ts">
import { Chart, registerables, type Chart as ChartType } from 'chart.js'
import Input from '@/components/ui/input.vue'
import {
  useFinanceDashboard,
  formatUsd,
  type PaidFilter,
} from '../composables/useFinanceDashboard'

Chart.register(...registerables)

useHead({
  title: 'Finance Dashboard',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const {
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
  availableYears,
  filteredExpenses,
  monthlyTotals,
  categoryTotals,
  summary,
  clearDateRange,
  toggleCategory,
  clearCategoryFilter,
} = useFinanceDashboard()

const monthlyCanvas = ref<HTMLCanvasElement | null>(null)
const categoryCanvas = ref<HTMLCanvasElement | null>(null)
let monthlyChart: ChartType | null = null
let categoryChart: ChartType | null = null

const monthOptions = [
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

const CATEGORY_COLORS = [
  'rgba(37, 99, 235, 0.85)',
  'rgba(14, 165, 233, 0.85)',
  'rgba(20, 184, 166, 0.85)',
  'rgba(234, 179, 8, 0.85)',
  'rgba(249, 115, 22, 0.85)',
  'rgba(239, 68, 68, 0.85)',
  'rgba(168, 85, 247, 0.85)',
  'rgba(100, 116, 139, 0.85)',
]

const selectClass
  = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

function destroyCharts() {
  monthlyChart?.destroy()
  categoryChart?.destroy()
  monthlyChart = null
  categoryChart = null
}

function renderCharts() {
  if (!monthlyCanvas.value || !categoryCanvas.value) return

  const usdTick = (value: string | number) =>
    formatUsd(typeof value === 'string' ? Number(value) : value)

  if (!monthlyChart) {
    monthlyChart = new Chart(monthlyCanvas.value, {
      type: 'bar',
      data: {
        labels: monthlyTotals.value.labels,
        datasets: [
          {
            label: 'Spend',
            data: [...monthlyTotals.value.data],
            backgroundColor: 'rgba(37, 99, 235, 0.75)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: usdTick },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => formatUsd(Number(ctx.raw ?? 0)),
            },
          },
        },
      },
    })
  }
  else {
    monthlyChart.data.labels = [...monthlyTotals.value.labels]
    monthlyChart.data.datasets[0].data = [...monthlyTotals.value.data]
    monthlyChart.update()
  }

  const catColors = categoryTotals.value.labels.map(
    (_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  )

  if (!categoryChart) {
    categoryChart = new Chart(categoryCanvas.value, {
      type: 'doughnut',
      data: {
        labels: [...categoryTotals.value.labels],
        datasets: [
          {
            label: 'Spend',
            data: [...categoryTotals.value.data],
            backgroundColor: catColors,
            borderWidth: 1,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const label = ctx.label ?? ''
                const value = formatUsd(Number(ctx.raw ?? 0))
                return `${label}: ${value}`
              },
            },
          },
        },
      },
    })
  }
  else {
    categoryChart.data.labels = [...categoryTotals.value.labels]
    categoryChart.data.datasets[0].data = [...categoryTotals.value.data]
    categoryChart.data.datasets[0].backgroundColor = catColors
    categoryChart.update()
  }
}

watch(
  [monthlyTotals, categoryTotals, loading],
  () => {
    if (loading.value) {
      destroyCharts()
      return
    }
    nextTick(() => renderCharts())
  },
  { deep: true },
)

onBeforeUnmount(() => {
  destroyCharts()
})
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-4 space-y-8">
    <header>
      <h1 class="text-3xl font-bold tracking-tight">
        Finance
      </h1>
      <p class="text-muted-foreground mt-2 max-w-prose">
        Personal spending overview by month and category.
      </p>
    </header>

    <!-- Filters -->
    <section class="space-y-4 border-b border-border pb-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium" for="filter-year">Year</label>
          <select
            id="filter-year"
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
          <label class="text-sm font-medium" for="filter-month">Month</label>
          <select
            id="filter-month"
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
          <label class="text-sm font-medium" for="filter-from">From</label>
          <Input
            id="filter-from"
            v-model="dateFrom"
            type="date"
          />
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium" for="filter-to">To</label>
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
            id="filter-to"
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
              :class="selectedCategoryIds.includes(cat.id)
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

        <div class="space-y-2">
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
      <!-- Summary -->
      <section class="grid gap-6 sm:grid-cols-3">
        <div>
          <p class="text-sm text-muted-foreground">
            Total spend
          </p>
          <p class="mt-1 text-2xl font-semibold tracking-tight">
            {{ formatUsd(summary.total) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">
            Expenses
          </p>
          <p class="mt-1 text-2xl font-semibold tracking-tight">
            {{ summary.count }}
          </p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">
            Average
          </p>
          <p class="mt-1 text-2xl font-semibold tracking-tight">
            {{ formatUsd(summary.average) }}
          </p>
        </div>
      </section>

      <p
        v-if="!filteredExpenses.length"
        class="text-sm text-muted-foreground"
      >
        No expenses match the current filters.
      </p>

      <!-- Charts -->
      <section class="grid gap-8 lg:grid-cols-2">
        <div class="space-y-3">
          <h2 class="text-lg font-semibold tracking-tight">
            Spend by month
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ dateFrom || dateTo ? 'Within selected date range' : `Year ${year}` }}
          </p>
          <div class="h-72">
            <canvas ref="monthlyCanvas" />
          </div>
        </div>

        <div class="space-y-3">
          <h2 class="text-lg font-semibold tracking-tight">
            Spend by category
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ dateFrom || dateTo
              ? 'Within selected date range'
              : monthOptions.find(m => m.value === month)?.label + ' ' + year }}
          </p>
          <div class="h-72">
            <canvas ref="categoryCanvas" />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
