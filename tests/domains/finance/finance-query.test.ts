import { describe, it, expect } from 'vitest'
import {
  categoryNameMap,
  normalizeCategories,
  normalizeExpenses,
  resolveCategoryName,
  type Category,
  type Expense,
} from '~/domains/finance/utils/finance-query'

describe('normalizeCategories', () => {
  it('coerces numeric ids to strings', () => {
    const rows = [
      { id: 1 as unknown as string, created_at: '', name: 'Food', note: null },
    ] as Category[]
    expect(normalizeCategories(rows)[0]!.id).toBe('1')
  })
})

describe('normalizeExpenses', () => {
  it('coerces numeric category FKs to strings so Map lookups match categories', () => {
    const rows = [
      {
        id: 10 as unknown as string,
        created_at: '',
        category: 1 as unknown as string,
        amount: 91,
        name: 'Coffee',
        paid_date: '2026-08-01',
        paid: true,
        note: null,
      },
    ] as Expense[]

    const expenses = normalizeExpenses(rows)
    const nameById = categoryNameMap([
      { id: 1 as unknown as string, created_at: '', name: 'Food', note: null },
    ] as Category[])

    expect(nameById.get(expenses[0]!.category)).toBe('Food')
  })
})

describe('resolveCategoryName', () => {
  const nameById = categoryNameMap([
    { id: '4', created_at: '', name: 'Food', note: null },
  ])

  it('prefers join name when present', () => {
    expect(resolveCategoryName('4', nameById, 'Food')).toBe('Food')
  })

  it('falls back to map lookup', () => {
    expect(resolveCategoryName('4', nameById)).toBe('Food')
  })

  it('returns Uncategorized for unknown or empty ids', () => {
    expect(resolveCategoryName('99', nameById)).toBe('Uncategorized')
    expect(resolveCategoryName('', nameById)).toBe('Uncategorized')
  })
})
