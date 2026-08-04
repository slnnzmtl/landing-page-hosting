export interface Category {
  id: string
  created_at: string
  name: string
  note: string | null
}

export interface Expense {
  id: string
  created_at: string
  category: string
  amount: number
  name: string
  paid_date: string
  paid: boolean
  note: string | null
}

export type PaidFilter = 'all' | 'paid' | 'unpaid'

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

const EXPENSE_COLUMNS = 'id, created_at, category, amount, name, paid_date, paid, note'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function monthBounds(year: number, month: number) {
  return {
    from: `${year}-${pad2(month)}-01`,
    to: `${year}-${pad2(month)}-${pad2(daysInMonth(year, month))}`,
  }
}

function yearBounds(year: number) {
  return {
    from: `${year}-01-01`,
    to: `${year}-12-31`,
  }
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function useFinanceDashboard() {
  const now = new Date()

  /** Category / summary window expenses (already filtered server-side). */
  const expenses = ref<Expense[]>([])
  /** Year (or custom range) expenses for the monthly bar chart. */
  const yearExpenses = ref<Expense[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const accessHint = ref<string | null>(null)
  const hasLoadedOnce = ref(false)

  const year = ref(now.getFullYear())
  const month = ref(now.getMonth() + 1)
  const dateFrom = ref('')
  const dateTo = ref('')
  const selectedCategoryIds = ref<string[]>([])
  const paidFilter = ref<PaidFilter>('all')

  let didSnapDefault = false
  let fetchGeneration = 0

  const availableYears = computed(() => {
    const years = new Set<number>()
    years.add(now.getFullYear())
    years.add(year.value)
    for (const e of yearExpenses.value) {
      if (e.paid_date) years.add(Number(e.paid_date.slice(0, 4)))
    }
    for (const e of expenses.value) {
      if (e.paid_date) years.add(Number(e.paid_date.slice(0, 4)))
    }
    return [...years].sort((a, b) => b - a)
  })

  const effectiveDateWindow = computed(() => {
    if (dateFrom.value || dateTo.value) {
      return {
        from: dateFrom.value || '0001-01-01',
        to: dateTo.value || '9999-12-31',
        isCustomRange: true,
      }
    }
    const bounds = monthBounds(year.value, month.value)
    return { ...bounds, isCustomRange: false }
  })

  const yearDateWindow = computed(() => {
    if (dateFrom.value || dateTo.value) {
      return {
        from: dateFrom.value || '0001-01-01',
        to: dateTo.value || '9999-12-31',
      }
    }
    return yearBounds(year.value)
  })

  /** Server already filtered; alias for template compatibility. */
  const filteredExpenses = computed(() => expenses.value)

  const monthlyTotals = computed(() => {
    const totals = Array.from({ length: 12 }, () => 0)
    for (const e of yearExpenses.value) {
      if (!e.paid_date) continue
      const m = Number(e.paid_date.slice(5, 7)) - 1
      if (m >= 0 && m < 12) totals[m] += e.amount
    }
    return {
      labels: [...MONTH_LABELS],
      data: totals,
    }
  })

  const categoryTotals = computed(() => {
    const nameById = new Map(categories.value.map(c => [c.id, c.name]))
    const map = new Map<string, { name: string, total: number }>()
    for (const e of expenses.value) {
      const id = e.category
      const name = nameById.get(id) ?? 'Uncategorized'
      const existing = map.get(id)
      if (existing) {
        existing.total += e.amount
      }
      else {
        map.set(id, { name, total: e.amount })
      }
    }
    const entries = [...map.values()].sort((a, b) => b.total - a.total)
    return {
      labels: entries.map(e => e.name),
      data: entries.map(e => e.total),
    }
  })

  const summary = computed(() => {
    const list = expenses.value
    const total = list.reduce((sum, e) => sum + e.amount, 0)
    const count = list.length
    const average = count > 0 ? Math.round(total / count) : 0
    return { total, count, average }
  })

  function buildExpenseQuery(from: string, to: string) {
    const supabase = useSupabase()
    let query = supabase
      .from('expense')
      .select(EXPENSE_COLUMNS)
      .gte('paid_date', from)
      .lte('paid_date', to)
      .order('paid_date', { ascending: false })

    if (paidFilter.value === 'paid') {
      query = query.eq('paid', true)
    }
    else if (paidFilter.value === 'unpaid') {
      query = query.eq('paid', false)
    }
    if (selectedCategoryIds.value.length > 0) {
      query = query.in('category', selectedCategoryIds.value)
    }
    return query
  }

  function snapToLatestMonth(rows: Expense[]) {
    const withDate = rows.filter(e => e.paid_date)
    if (!withDate.length) return false

    const latest = withDate.reduce((a, b) => (a.paid_date >= b.paid_date ? a : b))
    const nextYear = Number(latest.paid_date.slice(0, 4))
    const nextMonth = Number(latest.paid_date.slice(5, 7))

    const changed = nextYear !== year.value || nextMonth !== month.value
    if (changed) {
      year.value = nextYear
      month.value = nextMonth
    }
    return changed
  }

  async function fetchData() {
    const generation = ++fetchGeneration
    const showFullLoading = !hasLoadedOnce.value
    if (showFullLoading) loading.value = true
    error.value = null
    accessHint.value = null

    try {
      const categoryWindow = effectiveDateWindow.value
      const yearWindow = yearDateWindow.value
      const supabase = useSupabase()

      const categoryQuery = buildExpenseQuery(categoryWindow.from, categoryWindow.to)
      const yearQuery = buildExpenseQuery(yearWindow.from, yearWindow.to)
      const categoriesQuery = supabase
        .from('category')
        .select('id, created_at, name, note')
        .order('name', { ascending: true })

      const [categoryRes, yearRes, categoryListRes] = await Promise.all([
        categoryQuery,
        yearQuery,
        categoriesQuery,
      ])

      if (generation !== fetchGeneration) return

      if (categoryRes.error) throw categoryRes.error
      if (yearRes.error) throw yearRes.error
      if (categoryListRes.error) throw categoryListRes.error

      const categoryRows = (categoryRes.data ?? []) as Expense[]
      const yearRows = (yearRes.data ?? []) as Expense[]

      expenses.value = categoryRows
      yearExpenses.value = yearRows
      categories.value = (categoryListRes.data ?? []) as Category[]

      if (
        categories.value.length === 0
        && categoryRows.length === 0
        && yearRows.length === 0
      ) {
        accessHint.value
          = 'Supabase returned no rows (HTTP 200). If data exists in the Table Editor, enable SELECT for anon on public.category and public.expense — run domains/finance/supabase/rls-finance.sql in the SQL Editor.'
      }

      if (!didSnapDefault && !dateFrom.value && !dateTo.value) {
        if (categoryRows.length === 0 && yearRows.length > 0) {
          didSnapDefault = true
          const changed = snapToLatestMonth(yearRows)
          if (changed) return
        }
        else if (categoryRows.length === 0 && yearRows.length === 0) {
          let probe = supabase
            .from('expense')
            .select(EXPENSE_COLUMNS)
            .order('paid_date', { ascending: false })
            .limit(1)

          if (paidFilter.value === 'paid') {
            probe = probe.eq('paid', true)
          }
          else if (paidFilter.value === 'unpaid') {
            probe = probe.eq('paid', false)
          }
          if (selectedCategoryIds.value.length > 0) {
            probe = probe.in('category', selectedCategoryIds.value)
          }

          const probeRes = await probe
          if (generation !== fetchGeneration) return
          if (probeRes.error) throw probeRes.error

          const probeRows = (probeRes.data ?? []) as Expense[]
          didSnapDefault = true
          if (probeRows.length > 0) {
            const changed = snapToLatestMonth(probeRows)
            if (changed) return
          }
        }
        else {
          didSnapDefault = true
        }
      }
      else {
        didSnapDefault = true
      }

      hasLoadedOnce.value = true
    }
    catch (err) {
      if (generation !== fetchGeneration) return
      error.value = err instanceof Error ? err.message : 'Failed to load finance data'
      expenses.value = []
      yearExpenses.value = []
      categories.value = []
      hasLoadedOnce.value = true
    }
    finally {
      if (generation === fetchGeneration) {
        loading.value = false
      }
    }
  }

  function clearDateRange() {
    dateFrom.value = ''
    dateTo.value = ''
  }

  function toggleCategory(id: string) {
    const idx = selectedCategoryIds.value.indexOf(id)
    if (idx >= 0) {
      selectedCategoryIds.value = selectedCategoryIds.value.filter(c => c !== id)
    }
    else {
      selectedCategoryIds.value = [...selectedCategoryIds.value, id]
    }
  }

  function clearCategoryFilter() {
    selectedCategoryIds.value = []
  }

  watch(
    [year, month, dateFrom, dateTo, selectedCategoryIds, paidFilter],
    () => {
      fetchData()
    },
    { deep: true, immediate: true },
  )

  return {
    expenses,
    yearExpenses,
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
    availableYears,
    effectiveDateWindow,
    filteredExpenses,
    monthlyTotals,
    categoryTotals,
    summary,
    fetchData,
    clearDateRange,
    toggleCategory,
    clearCategoryFilter,
    formatUsd,
    MONTH_LABELS,
  }
}
