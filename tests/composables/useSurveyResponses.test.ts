import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSurveyResponses } from '~/composables/useSurveyResponses'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useSurveyResponses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSurveyResponses', () => {
    it('should return empty array when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { getSurveyResponses } = useSurveyResponses()
      const result = getSurveyResponses()

      expect(result).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith('surveyResponses')
    })

    it('should return parsed responses from localStorage', () => {
      const mockResponses = [
        { slug: 'test-survey', response: { q1: 'answer1' }, isSubmitted: false },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockResponses))

      const { getSurveyResponses } = useSurveyResponses()
      const result = getSurveyResponses()

      expect(result).toEqual(mockResponses)
    })

    it('should return empty array when localStorage contains invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { getSurveyResponses } = useSurveyResponses()
      const result = getSurveyResponses()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should return empty array when running on server side', () => {
      // Temporarily remove window to simulate server-side
      const originalWindow = global.window
      // @ts-expect-error - intentionally deleting window for testing
      delete global.window

      const { getSurveyResponses } = useSurveyResponses()
      const result = getSurveyResponses()

      expect(result).toEqual([])

      // Restore window
      global.window = originalWindow
    })
  })

  describe('setSurveyResponse', () => {
    it('should add new survey response', () => {
      localStorageMock.getItem.mockReturnValue('[]')

      const { setSurveyResponse } = useSurveyResponses()
      setSurveyResponse('test-survey', { q1: 'answer1' })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'surveyResponses',
        JSON.stringify([{ slug: 'test-survey', response: { q1: 'answer1' }, isSubmitted: false }]),
      )
    })

    it('should update existing survey response', () => {
      const existingResponses = [
        { slug: 'test-survey', response: { q1: 'old-answer' }, isSubmitted: false },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingResponses))

      const { setSurveyResponse } = useSurveyResponses()
      setSurveyResponse('test-survey', { q1: 'new-answer' })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'surveyResponses',
        JSON.stringify([{ slug: 'test-survey', response: { q1: 'new-answer' }, isSubmitted: false }]),
      )
    })

    it('should not set response on server side', () => {
      // Temporarily remove window to simulate server-side
      const originalWindow = global.window
      // @ts-expect-error - intentionally deleting window for testing
      delete global.window

      const { setSurveyResponse } = useSurveyResponses()
      setSurveyResponse('test-survey', { q1: 'answer1' })

      expect(localStorageMock.setItem).not.toHaveBeenCalled()

      // Restore window
      global.window = originalWindow
    })
  })

  describe('getSurveyResponse', () => {
    it('should return specific survey response', () => {
      const responses = [
        { slug: 'survey1', response: { q1: 'answer1' } },
        { slug: 'survey2', response: { q1: 'answer2' } },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(responses))

      const { getSurveyResponse } = useSurveyResponses()
      const result = getSurveyResponse('survey2')

      expect(result).toEqual({ q1: 'answer2' })
    })

    it('should return null for non-existent survey', () => {
      localStorageMock.getItem.mockReturnValue('[]')

      const { getSurveyResponse } = useSurveyResponses()
      const result = getSurveyResponse('non-existent')

      expect(result).toBeNull()
    })

    it('should return null on server side', () => {
      // Temporarily remove window to simulate server-side
      const originalWindow = global.window
      // @ts-expect-error - intentionally deleting window for testing
      delete global.window

      const { getSurveyResponse } = useSurveyResponses()
      const result = getSurveyResponse('test-survey')

      expect(result).toBeNull()

      // Restore window
      global.window = originalWindow
    })
  })

  describe('addSurveySlug', () => {
    it('should add new survey slug with empty response', () => {
      localStorageMock.getItem.mockReturnValue('[]')

      const { addSurveySlug } = useSurveyResponses()
      addSurveySlug('new-survey')

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'surveyResponses',
        JSON.stringify([{ slug: 'new-survey', response: {}, isSubmitted: false }]),
      )
    })

    it('should not add duplicate survey slug', () => {
      const existingResponses = [
        { slug: 'existing-survey', response: { q1: 'answer' }, isSubmitted: false },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingResponses))

      const { addSurveySlug } = useSurveyResponses()
      addSurveySlug('existing-survey')

      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })

    it('should not add slug on server side', () => {
      // Temporarily remove window to simulate server-side
      const originalWindow = global.window
      // @ts-expect-error - intentionally deleting window for testing
      delete global.window

      const { addSurveySlug } = useSurveyResponses()
      addSurveySlug('test-survey')

      expect(localStorageMock.setItem).not.toHaveBeenCalled()

      // Restore window
      global.window = originalWindow
    })
  })

  describe('getSurveySubmissionId', () => {
    it('should return submission ID for existing survey', () => {
      const mockResponses = [
        { slug: 'test-survey', response: { q1: 'answer1' }, isSubmitted: true, submissionId: 'sub-123' },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockResponses))

      const { getSurveySubmissionId } = useSurveyResponses()
      const result = getSurveySubmissionId('test-survey')

      expect(result).toBe('sub-123')
    })

    it('should return null for survey without submission ID', () => {
      const mockResponses = [
        { slug: 'test-survey', response: { q1: 'answer1' }, isSubmitted: false },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockResponses))

      const { getSurveySubmissionId } = useSurveyResponses()
      const result = getSurveySubmissionId('test-survey')

      expect(result).toBe(null)
    })

    it('should return null for non-existent survey', () => {
      localStorageMock.getItem.mockReturnValue('[]')

      const { getSurveySubmissionId } = useSurveyResponses()
      const result = getSurveySubmissionId('non-existent')

      expect(result).toBe(null)
    })
  })

  describe('isSurveySubmitted', () => {
    it('should return true for submitted survey', () => {
      const mockResponses = [
        { slug: 'test-survey', response: { q1: 'answer1' }, isSubmitted: true },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockResponses))

      const { isSurveySubmitted } = useSurveyResponses()
      const result = isSurveySubmitted('test-survey')

      expect(result).toBe(true)
    })

    it('should return false for non-submitted survey', () => {
      const mockResponses = [
        { slug: 'test-survey', response: { q1: 'answer1' }, isSubmitted: false },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockResponses))

      const { isSurveySubmitted } = useSurveyResponses()
      const result = isSurveySubmitted('test-survey')

      expect(result).toBe(false)
    })

    it('should return false for non-existent survey', () => {
      localStorageMock.getItem.mockReturnValue('[]')

      const { isSurveySubmitted } = useSurveyResponses()
      const result = isSurveySubmitted('non-existent')

      expect(result).toBe(false)
    })
  })
})
