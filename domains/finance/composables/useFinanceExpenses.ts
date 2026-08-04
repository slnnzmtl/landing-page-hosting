import {
  ACCESS_HINT,
  EXPENSE_COLUMNS,
  EXPENSE_WITH_CATEGORY_SELECT,
  buildExpenseQuery,
  categoryNameMap,
  formatUsd,
  normalizeCategories,
  normalizeExpenses,
  resolveCategoryName,
  type Category,
  type Expense,
  type ExpenseSortColumn,
} from '../utils/finance-query'
import { useFinanceFilterState } from './useFinanceFilterState'

export interface ExpenseRow extends Expense {
  categoryName: string
}

interface CategoryEmbed {
  id: string
  name: string
}

interface ExpenseWithCategoryJoin {
  id: string
  created_at: string
  amount: number
  name: string
  paid_date: string
  paid: boolean
  note: string | null
  category: string
  category_row: CategoryEmbed | CategoryEmbed[] | null
}

function embedCategoryName(
  embed: CategoryEmbed | CategoryEmbed[] | null | undefined,
): string | null {
  if (!embed) return null
  if (Array.isArray(embed)) return embed[0]?.name ?? null
  return embed.name ?? null
}

function mapJoinedRows(
  rows: ExpenseWithCategoryJoin[],
  categories: Category[],
): ExpenseRow[] {
  const nameById = categoryNameMap(categories)
  const normalized = normalizeExpenses(
    rows.map(({ category_row: _ignored, ...expense }) => expense),
  )
  return normalized.map((row, i) => ({
    ...row,
    categoryName: resolveCategoryName(
      row.category,
      nameById,
      embedCategoryName(rows[i]!.category_row),
    ),
  }))
}

function mapFlatRows(rows: Expense[], categories: Category[]): ExpenseRow[] {
  const nameById = categoryNameMap(categories)
  return normalizeExpenses(rows).map(row => ({
    ...row,
    categoryName: resolveCategoryName(row.category, nameById),
  }))
}

export function useFinanceExpenses() {
  const now = new Date()

  const {
    year,
    month,
    dateFrom,
    dateTo,
    selectedCategoryIds,
    paidFilter,
    page,
    pageSize,
    sortBy,
    sortDir,
    filterQuery,
    effectiveDateWindow,
    syncingFromRoute,
    clearDateRange,
    toggleCategory,
    clearCategoryFilter,
    isCategorySelected,
  } = useFinanceFilterState({
    defaults: {
      year: now.getFullYear(),
      /** 0 = all months in the selected year (year-wide list for pagination). */
      month: 0,
      paidFilter: 'all',
      page: 1,
      pageSize: 25,
      sortBy: 'paid_date',
      sortDir: 'desc',
    },
    allowAllMonths: true,
  })

  const rows = ref<ExpenseRow[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const accessHint = ref<string | null>(null)
  const hasLoadedOnce = ref(false)

  const totalCount = ref(0)
  const totalAmount = ref(0)

  let fetchGeneration = 0

  const availableYears = computed(() => {
    const years = new Set<number>()
    years.add(now.getFullYear())
    years.add(year.value)
    for (const e of rows.value) {
      if (e.paid_date) years.add(Number(e.paid_date.slice(0, 4)))
    }
    return [...years].sort((a, b) => b - a)
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / pageSize.value) || 1),
  )

  const pageRangeLabel = computed(() => {
    if (totalCount.value === 0) return 'Showing 0 of 0'
    const start = (page.value - 1) * pageSize.value + 1
    const end = Math.min(page.value * pageSize.value, totalCount.value)
    return `Showing ${start}–${end} of ${totalCount.value}`
  })

  async function fetchPage() {
    const generation = ++fetchGeneration
    const showFullLoading = !hasLoadedOnce.value
    if (showFullLoading) loading.value = true
    error.value = null
    accessHint.value = null

    try {
      const window = effectiveDateWindow.value
      const supabase = useSupabase()
      const rangeFrom = (page.value - 1) * pageSize.value
      const rangeTo = page.value * pageSize.value - 1

      const categoriesQuery = supabase
        .from('category')
        .select('id, created_at, name, note')
        .order('name', { ascending: true })

      const joinedQuery = buildExpenseQuery(supabase, {
        from: window.from,
        to: window.to,
        paidFilter: paidFilter.value,
        selectedCategoryIds: selectedCategoryIds.value,
        select: EXPENSE_WITH_CATEGORY_SELECT,
        count: 'exact',
        range: { from: rangeFrom, to: rangeTo },
        sortBy: sortBy.value,
        sortDir: sortDir.value,
      })

      const amountQuery = buildExpenseQuery(supabase, {
        from: window.from,
        to: window.to,
        paidFilter: paidFilter.value,
        selectedCategoryIds: selectedCategoryIds.value,
        select: 'amount',
      })

      const [joinedRes, categoryListRes, amountRes] = await Promise.all([
        joinedQuery,
        categoriesQuery,
        amountQuery,
      ])

      if (generation !== fetchGeneration) return

      if (categoryListRes.error) throw categoryListRes.error
      if (amountRes.error) throw amountRes.error
      categories.value = normalizeCategories((categoryListRes.data ?? []) as Category[])

      const amountRows = (amountRes.data ?? []) as { amount: number }[]
      totalAmount.value = amountRows.reduce((sum, r) => sum + (r.amount ?? 0), 0)

      let expenseRows: ExpenseRow[] = []
      let count = 0

      if (joinedRes.error) {
        // Fallback: flat select + client-side category name resolution
        const flatRes = await buildExpenseQuery(supabase, {
          from: window.from,
          to: window.to,
          paidFilter: paidFilter.value,
          selectedCategoryIds: selectedCategoryIds.value,
          select: EXPENSE_COLUMNS,
          count: 'exact',
          range: { from: rangeFrom, to: rangeTo },
          sortBy: sortBy.value,
          sortDir: sortDir.value,
        })
        if (generation !== fetchGeneration) return
        if (flatRes.error) throw flatRes.error

        expenseRows = mapFlatRows((flatRes.data ?? []) as Expense[], categories.value)
        count = flatRes.count ?? expenseRows.length
      }
      else {
        expenseRows = mapJoinedRows(
          (joinedRes.data ?? []) as unknown as ExpenseWithCategoryJoin[],
          categories.value,
        )
        count = joinedRes.count ?? expenseRows.length
      }

      rows.value = expenseRows
      totalCount.value = count

      if (
        categories.value.length === 0
        && expenseRows.length === 0
        && count === 0
      ) {
        accessHint.value = ACCESS_HINT
      }

      // Clamp page if result set shrank below the current page
      if (page.value > 1 && expenseRows.length === 0 && count > 0) {
        page.value = Math.max(1, Math.ceil(count / pageSize.value))
        return
      }

      hasLoadedOnce.value = true
    }
    catch (err) {
      if (generation !== fetchGeneration) return
      error.value = err instanceof Error ? err.message : 'Failed to load expenses'
      rows.value = []
      totalCount.value = 0
      totalAmount.value = 0
      categories.value = []
      hasLoadedOnce.value = true
    }
    finally {
      if (generation === fetchGeneration) {
        loading.value = false
      }
    }
  }

  function goToPrevPage() {
    if (page.value > 1) page.value -= 1
  }

  function goToNextPage() {
    if (page.value < totalPages.value) page.value += 1
  }

  function toggleSort(column: ExpenseSortColumn) {
    if (sortBy.value === column) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
      return
    }
    sortBy.value = column
    sortDir.value = column === 'paid_date' ? 'desc' : 'asc'
  }

  watch(
    [year, month, dateFrom, dateTo, selectedCategoryIds, paidFilter, pageSize, sortBy, sortDir],
    () => {
      if (!syncingFromRoute.value && page.value !== 1) {
        page.value = 1
        return
      }
      fetchPage()
    },
    { deep: true, immediate: true },
  )

  watch(page, () => {
    fetchPage()
  })

  return {
    rows,
    categories,
    loading,
    error,
    accessHint,
    hasLoadedOnce,
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
    totalCount,
    totalAmount,
    totalPages,
    pageRangeLabel,
    availableYears,
    effectiveDateWindow,
    fetchPage,
    clearDateRange,
    toggleCategory,
    clearCategoryFilter,
    isCategorySelected,
    toggleSort,
    goToPrevPage,
    goToNextPage,
    formatUsd,
  }
}
