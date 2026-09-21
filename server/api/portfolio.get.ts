import { loadPortfolio } from '~/utils/cms/load'
import { resolveDirectusConfig } from '~/utils/cms/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const portfolio = await loadPortfolio(resolveDirectusConfig(config))
  const { homepage, experience, products, experiencePage } = portfolio
  return { homepage, experience, products, experiencePage }
})
