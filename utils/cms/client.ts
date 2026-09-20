export interface DirectusClientConfig {
  baseUrl: string
  token: string
}

/** Env vars and/or Nuxt `runtimeConfig` fields (`directusUrl` / `directusToken`). */
export type DirectusConfigSource = {
  DIRECTUS_URL?: string
  DIRECTUS_TOKEN?: string
  directusUrl?: string
  directusToken?: string
}

export function resolveDirectusConfig(
  source: DirectusConfigSource = process.env as DirectusConfigSource,
): DirectusClientConfig {
  const rawBaseUrl = source.directusUrl || source.DIRECTUS_URL
  if (!rawBaseUrl) {
    throw new Error(
      'Directus URL missing. Set DIRECTUS_URL (server-only) for build/dev.',
    )
  }
  const baseUrl = rawBaseUrl.replace(/\/+$/, '')
  const token = source.directusToken || source.DIRECTUS_TOKEN || ''
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
