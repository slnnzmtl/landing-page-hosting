import { loadPortfolio } from '~/utils/cms/load'
import { resolveDirectusConfig } from '~/utils/cms/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const portfolio = await loadPortfolio(resolveDirectusConfig(config))
  const { homepage, experience, projects, products, cases, experiencePage } = portfolio
  return { homepage, experience, projects, products, cases, experiencePage }
})
