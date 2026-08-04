import type { SupabaseClient } from '@supabase/supabase-js'

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

export type ExpenseSortColumn = 'paid_date' | 'name' | 'amount' | 'paid'
export type SortDir = 'asc' | 'desc'

export const EXPENSE_SORT_COLUMNS = new Set<ExpenseSortColumn>([
  'paid_date',
  'name',
  'amount',
  'paid',
])

export const EXPENSE_COLUMNS = 'id, created_at, category, amount, name, paid_date, paid, note'

export const EXPENSE_WITH_CATEGORY_SELECT = `
  id, created_at, amount, name, paid_date, paid, note, category,
  category_row:category!category(id, name)
`.replace(/\s+/g, ' ').trim()

export const ACCESS_HINT
  = 'Supabase returned no rows (HTTP 200). If data exists in the Table Editor, enable SELECT for anon on public.category and public.expense — run domains/finance/supabase/rls-finance.sql in the SQL Editor.'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export function monthBounds(year: number, month: number) {
  return {
    from: `${year}-${pad2(month)}-01`,
    to: `${year}-${pad2(month)}-${pad2(daysInMonth(year, month))}`,
  }
}

export function yearBounds(year: number) {
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

/** Ensure category ids are strings (Supabase may return uuid/number). */
export function normalizeCategories(rows: Category[]): Category[] {
  return rows.map(c => ({
    ...c,
    id: String(c.id),
  }))
}

/** Ensure expense ids and category FKs are strings for Map lookups. */
export function normalizeExpenses(rows: Expense[]): Expense[] {
  return rows.map(e => ({
    ...e,
    id: String(e.id),
    category: e.category == null ? '' : String(e.category),
  }))
}

export function categoryNameMap(categories: Category[]): Map<string, string> {
  return new Map(normalizeCategories(categories).map(c => [c.id, c.name]))
}

export function resolveCategoryName(
  categoryId: string,
  nameById: Map<string, string>,
  joinName?: string | null,
): string {
  return joinName ?? (categoryId ? nameById.get(categoryId) : undefined) ?? 'Uncategorized'
}

export interface BuildExpenseQueryOptions {
  from: string
  to: string
  paidFilter: PaidFilter
  selectedCategoryIds: string[]
  select?: string
  range?: { from: number, to: number }
  count?: 'exact'
  sortBy?: ExpenseSortColumn
  sortDir?: SortDir
}

export function buildExpenseQuery(
  supabase: SupabaseClient,
  options: BuildExpenseQueryOptions,
) {
  const {
    from,
    to,
    paidFilter,
    selectedCategoryIds,
    select = EXPENSE_COLUMNS,
    range,
    count,
    sortBy = 'paid_date',
    sortDir = 'desc',
  } = options

  const orderColumn = EXPENSE_SORT_COLUMNS.has(sortBy) ? sortBy : 'paid_date'

  let query = supabase
    .from('expense')
    .select(select, count ? { count } : undefined)
    .gte('paid_date', from)
    .lte('paid_date', to)
    .order(orderColumn, { ascending: sortDir === 'asc' })

  if (paidFilter === 'paid') {
    query = query.eq('paid', true)
  }
  else if (paidFilter === 'unpaid') {
    query = query.eq('paid', false)
  }
  if (selectedCategoryIds.length > 0) {
    query = query.in('category', selectedCategoryIds)
  }
  if (range) {
    query = query.range(range.from, range.to)
  }
  return query
}
