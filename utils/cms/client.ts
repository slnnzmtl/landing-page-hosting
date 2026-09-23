export interface DirectusClientConfig {
  baseUrl: string
  token: string
}

/** Canonical Directus origin; `DIRECTUS_URL` is optional when this host is used. */
export const DEFAULT_DIRECTUS_URL = 'https://cms.kazansky.dev'

/** Env vars and/or Nuxt `runtimeConfig` fields (`directusUrl` / `directusToken`). */
export type DirectusConfigSource = {
  DIRECTUS_URL?: string
  DIRECTUS_TOKEN?: string
  directusUrl?: string
  directusToken?: string
}

/** Strip whitespace and wrapping quotes (common when pasting into Vercel env). */
export function normalizeDirectusToken(raw: string | undefined): string {
  return (raw || '').trim().replace(/^["']|["']$/g, '')
}

/**
 * Fetch CMS prerender slugs during `nuxt generate` / `nuxt dev` only.
 * `nuxt prepare` (postinstall) and Vitest must not require Directus — Vercel
 * injects DIRECTUS_TOKEN during `pnpm install`, which would otherwise 401 the install.
 */
export function shouldFetchCmsPrerenderSlugs(
  env: NodeJS.Dict<string> = process.env,
  argv: readonly string[] = process.argv,
): boolean {
  const token = normalizeDirectusToken(env.DIRECTUS_TOKEN || env.NUXT_DIRECTUS_TOKEN)
  if (!token) return false
  if (env.VITEST) return false
  const lifecycle = env.npm_lifecycle_event || ''
  if (lifecycle === 'postinstall' || lifecycle === 'prepare') return false
  if (argv.some(arg => arg === 'prepare' || /[/\\]prepare(?:\.mjs)?$/.test(arg))) {
    return false
  }
  return true
}

export function resolveDirectusConfig(
  source: DirectusConfigSource = process.env as DirectusConfigSource,
): DirectusClientConfig {
  const rawBaseUrl = source.directusUrl || source.DIRECTUS_URL || DEFAULT_DIRECTUS_URL
  const baseUrl = rawBaseUrl.replace(/\/+$/, '')
  const token = normalizeDirectusToken(source.directusToken || source.DIRECTUS_TOKEN)
  if (!token) {
    throw new Error(
      'Directus token missing. Set DIRECTUS_TOKEN (server-only) for build/dev.',
    )
  }
  return { baseUrl, token }
}

export async function directusGet<T>(
  config: DirectusClientConfig,
  pathAndQuery: string,
): Promise<T> {
  const path = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`
  const res = await fetch(`${config.baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${config.token}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Directus ${res.status} ${path}: ${body}`)
  }
  const json = await res.json() as { data: T }
  return json.data
}

export function assetUrl(
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  fileId: string,
  query = '',
): string {
  const q = query ? `?${query}` : ''
  return `${config.baseUrl}/assets/${fileId}${q}`
}

/** Minimal file fields needed to resolve a public URL. */
export type CmsPublicFile = {
  id: string
  filename_download: string
  /** Original public path, e.g. /images/experience/upwork.png */
  title?: string | null
}

/**
 * Public site path for a Directus file.
 * Prefer `files.title` when it is a safe absolute path; otherwise `/cms-files/:id/:name`.
 */
export function publicPathForFile(file: CmsPublicFile): string {
  const title = file.title?.trim()
  if (
    title
    && title.startsWith('/')
    && !title.includes('..')
    && !title.includes('\\')
  ) {
    return title
  }
  const name = file.filename_download || file.id
  return `/cms-files/${file.id}/${name}`
}
