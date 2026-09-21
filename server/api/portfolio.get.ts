import { loadPortfolio } from '~/utils/cms/load'
import { resolveDirectusConfig } from '~/utils/cms/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const portfolio = await loadPortfolio(resolveDirectusConfig(config))
  return {
    homepage: portfolio.homepage,
    experience: portfolio.experience,
    products: portfolio.products,
    professionalTenure: portfolio.professionalTenure,
    experiencePage: portfolio.experiencePage,
  }
})
