import { describe, it, expect } from 'vitest'
import { useSurveys } from '~/pages/survey/composables/useSurveys'

describe('useSurveys', () => {
  describe('surveys', () => {
    it('should load surveys from data directory', () => {
      const { surveys } = useSurveys()
      
      expect(Array.isArray(surveys)).toBe(true)
      expect(surveys.length).toBeGreaterThan(0)
    })

    it('should sort surveys alphabetically by title', () => {
      const { surveys } = useSurveys()
      
      for (let i = 1; i < surveys.length; i++) {
        expect(surveys[i].title >= surveys[i - 1].title).toBe(true)
      }
    })

    it('should have valid survey structure', () => {
      const { surveys } = useSurveys()
      
      surveys.forEach(survey => {
        expect(survey).toHaveProperty('slug')
        expect(survey).toHaveProperty('title')
        expect(survey).toHaveProperty('description')
        expect(survey).toHaveProperty('questions')
        expect(survey).toHaveProperty('googleForm')
        
        expect(typeof survey.slug).toBe('string')
        expect(typeof survey.title).toBe('string')
        expect(typeof survey.description).toBe('string')
        expect(Array.isArray(survey.questions)).toBe(true)
        
        expect(survey.googleForm).toHaveProperty('action')
        expect(survey.googleForm).toHaveProperty('entryMap')
        expect(survey.googleForm).toHaveProperty('formId')
      })
    })

    it('should have questions with correct structure', () => {
      const { surveys } = useSurveys()
      
      surveys.forEach(survey => {
        survey.questions.forEach(question => {
          expect(question).toHaveProperty('type')
          
          if (question.type === 'section') {
            expect(question).toHaveProperty('title')
          } else {
            expect(question).toHaveProperty('id')
            expect(question).toHaveProperty('label')
            
            if (question.type === 'radio') {
              expect(question).toHaveProperty('options')
              expect(Array.isArray((question as any).options)).toBe(true)
            }
          }
        })
      })
    })
  })

  describe('findSurvey', () => {
    it('should find existing surveys', () => {
      const { surveys, findSurvey } = useSurveys()
      
      if (surveys.length > 0) {
        const firstSurvey = surveys[0]
        const foundSurvey = findSurvey(firstSurvey.slug)
        
        expect(foundSurvey).toBeDefined()
        expect(foundSurvey?.slug).toBe(firstSurvey.slug)
        expect(foundSurvey?.title).toBe(firstSurvey.title)
      }
    })

    it('should return undefined for non-existent survey', () => {
      const { findSurvey } = useSurveys()
      
      const result = findSurvey('non-existent-survey-slug')
      
      expect(result).toBeUndefined()
    })

    it('should return undefined for empty slug', () => {
      const { findSurvey } = useSurveys()
      
      const result = findSurvey('')
      
      expect(result).toBeUndefined()
    })

    it('should be case sensitive', () => {
      const { surveys, findSurvey } = useSurveys()
      
      if (surveys.length > 0) {
        const firstSurvey = surveys[0]
        const upperCaseSlug = firstSurvey.slug.toUpperCase()
        
        if (upperCaseSlug !== firstSurvey.slug) {
          const result = findSurvey(upperCaseSlug)
          expect(result).toBeUndefined()
        }
      }
    })
  })

  describe('integration with real data', () => {
    it('should load sweet-loyalty survey if it exists', () => {
      const { findSurvey } = useSurveys()
      
      const sweetLoyalty = findSurvey('sweet-loyalty')
      
      if (sweetLoyalty) {
        expect(sweetLoyalty.title).toBe('Опросный лист для проекта')
        expect(sweetLoyalty.description).toContain('разработки')
        expect(sweetLoyalty.questions.length).toBeGreaterThan(0)
        expect(sweetLoyalty.googleForm.action).toBeTruthy()
      }
    })
  })
})