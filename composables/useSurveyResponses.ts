import { z } from 'zod'

const surveyResponseSchema = z.object({
  slug: z.string(),
  response: z.record(z.string(), z.string()),
})

const surveyResponsesSchema = z.array(surveyResponseSchema)

export const useSurveyResponses = () => {
  const getSurveyResponses = () => {
    if (typeof window === 'undefined') {
      return []
    }
    const responses = localStorage.getItem('surveyResponses')
    if (!responses) {
      return []
    }
    try {
      return surveyResponsesSchema.parse(JSON.parse(responses))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const setSurveyResponse = (
    slug: string,
    response: Record<string, string>,
  ) => {
    if (typeof window === 'undefined') {
      return
    }
    const responses = getSurveyResponses()
    const newResponse = { slug, response }
    const existingResponseIndex = responses.findIndex(
      (r: z.infer<typeof surveyResponseSchema>) => r.slug === slug,
    )
    if (existingResponseIndex !== -1) {
      responses[existingResponseIndex] = newResponse
    }
    else {
      responses.push(newResponse)
    }
    localStorage.setItem('surveyResponses', JSON.stringify(responses))
  }

  const getSurveyResponse = (slug: string) => {
    if (typeof window === 'undefined') {
      return null
    }
    const responses = getSurveyResponses()
    const response = responses.find(
      (r: z.infer<typeof surveyResponseSchema>) => r.slug === slug,
    )
    return response ? response.response : null
  }

  const addSurveySlug = (slug: string) => {
    if (typeof window === 'undefined') {
      return
    }
    const responses = getSurveyResponses()
    const existingResponse = responses.find(
      (r: z.infer<typeof surveyResponseSchema>) => r.slug === slug,
    )
    if (!existingResponse) {
      responses.push({ slug, response: {} })
      localStorage.setItem('surveyResponses', JSON.stringify(responses))
    }
  }

  return {
    getSurveyResponses,
    setSurveyResponse,
    addSurveySlug,
    getSurveyResponse,
  }
}
