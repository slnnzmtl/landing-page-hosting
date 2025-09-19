interface QuestionBase {
  id: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
}
interface TextQ extends QuestionBase {
  type: 'text' | 'email'
}
interface TextareaQ extends QuestionBase {
  type: 'textarea'
}
interface RadioQ extends QuestionBase {
  type: 'radio'
  options: { label: string, value: string }[]
}
interface SectionQ {
  type: 'section'
  title: string
  description?: string
  id?: string // Added to support key prop
}
export interface SurveyDef {
  slug: string
  title: string
  description: string
  questions: (TextQ | TextareaQ | RadioQ | SectionQ)[]
  googleForm: {
    action: string
    entryMap: Record<string, string>
    formId: string
  }
}
export const useSurveys = () => {
  // Eagerly import all JSON survey definition files in data directory
  const modules = import.meta.glob('~/pages/survey/data/*.json', {
    eager: true,
  })

  // Extract default export (parsed JSON) from each module and cast
  const surveys = Object.values(modules).map(
    (m: unknown) => {
      const module = m as Record<string, unknown>
      return (module.default as unknown as SurveyDef) || (module as unknown as SurveyDef)
    },
  )

  // (Optional) sort by title for consistent ordering
  surveys.sort((a, b) => a.title.localeCompare(b.title))

  const findSurvey = (slug: string) => {
    const found = surveys.find(s => s.slug === slug)
    if (!found) {
      console.warn(`Survey with slug "${slug}" not found. Available surveys:`, surveys.map(s => s.slug))
    }
    return found
  }

  return {
    surveys,
    findSurvey,
  }
}
