export const GITHUB_RELEASES_CACHE_PREFIX = 'github-releases:'
export const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000
export const RECENT_RELEASE_LIMIT = 4

export interface GithubReleaseAsset {
  name: string
  size: number
  sizeLabel: string
  browserDownloadUrl: string
}

export interface GithubRelease {
  id: number
  tagName: string
  name: string
  htmlUrl: string
  publishedAt: string | null
  publishedLabel: string
  prerelease: boolean
  notes: string
  assets: GithubReleaseAsset[]
}

export interface CachedReleases {
  fetchedAt: number
  releases: GithubRelease[]
}

export type GithubReleasesStatus
  = 'idle'
    | 'loading'
    | 'success'
    | 'empty'
    | 'error'
    | 'stale'

export interface GithubReleasesResult {
  status: GithubReleasesStatus
  releases: GithubRelease[]
  latest: GithubRelease | undefined
  recent: GithubRelease[]
  errorMessage: string | null
  viewAllUrl: string
}

export function githubReleasesApiUrl(owner: string, repo: string): string {
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases`
}

export function githubReleasesPageUrl(owner: string, repo: string): string {
  return `https://github.com/${owner}/${repo}/releases`
}

export function githubReleasesCacheKey(owner: string, repo: string): string {
  return `${GITHUB_RELEASES_CACHE_PREFIX}${owner}/${repo}`
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return 'Unknown size'
  if (bytes < 1024) return `${Math.round(bytes)} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const digits = value >= 10 || unitIndex === 0 ? 0 : 1
  return `${value.toFixed(digits)} ${units[unitIndex]}`
}

export function formatReleaseDate(iso: string | null): string {
  if (!iso) return 'Unknown date'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function releaseNotesToPlainText(raw: string | null | undefined): string {
  if (!raw) return ''
  let text = raw.replace(/<[^>]+>/g, '')
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  text = text.replace(/[`*_>#]/g, '')
  return text.replace(/\r\n/g, '\n').trim()
}

export function isRateLimitStatus(status: number): boolean {
  return status === 403 || status === 429
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  return value as Record<string, unknown>
}

function normalizeAsset(value: unknown): GithubReleaseAsset | null {
  const asset = asRecord(value)
  if (!asset) return null
  if (asset.state && asset.state !== 'uploaded') return null
  const name = typeof asset.name === 'string' ? asset.name : ''
  const url = typeof asset.browser_download_url === 'string' ? asset.browser_download_url : ''
  const size = typeof asset.size === 'number' ? asset.size : 0
  if (!name || !url) return null
  return {
    name,
    size,
    sizeLabel: formatBytes(size),
    browserDownloadUrl: url,
  }
}

function normalizeRelease(value: unknown): GithubRelease | null {
  const release = asRecord(value)
  if (!release || release.draft === true) return null
  const id = typeof release.id === 'number' ? release.id : 0
  const tagName = typeof release.tag_name === 'string' ? release.tag_name : ''
  const htmlUrl = typeof release.html_url === 'string' ? release.html_url : ''
  if (!id || !tagName || !htmlUrl) return null
  const publishedAt = typeof release.published_at === 'string' ? release.published_at : null
  const assets = Array.isArray(release.assets)
    ? release.assets.map(normalizeAsset).filter((asset): asset is GithubReleaseAsset => Boolean(asset))
    : []
  const name = typeof release.name === 'string' && release.name.trim()
    ? release.name.trim()
    : tagName
  return {
    id,
    tagName,
    name,
    htmlUrl,
    publishedAt,
    publishedLabel: formatReleaseDate(publishedAt),
    prerelease: release.prerelease === true,
    notes: releaseNotesToPlainText(typeof release.body === 'string' ? release.body : ''),
    assets,
  }
}

export function normalizeReleases(payload: unknown): GithubRelease[] {
  if (!Array.isArray(payload)) return []
  return payload.map(normalizeRelease).filter((release): release is GithubRelease => Boolean(release))
}

export function readCachedReleases(storage: Pick<Storage, 'getItem'>, key: string): CachedReleases | null {
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedReleases
    if (!parsed || !Array.isArray(parsed.releases) || typeof parsed.fetchedAt !== 'number') return null
    return parsed
  }
  catch {
    return null
  }
}

export function writeCachedReleases(
  storage: Pick<Storage, 'setItem'>,
  key: string,
  cache: CachedReleases,
): void {
  storage.setItem(key, JSON.stringify(cache))
}

export function splitLatestAndRecent(releases: GithubRelease[]) {
  return {
    latest: releases[0],
    recent: releases.slice(1, RECENT_RELEASE_LIMIT + 1),
  }
}

export function emptyGithubReleasesResult(owner: string, repo: string): GithubReleasesResult {
  return {
    status: 'idle',
    releases: [],
    latest: undefined,
    recent: [],
    errorMessage: null,
    viewAllUrl: githubReleasesPageUrl(owner, repo),
  }
}

export async function loadGithubReleases(options: {
  owner: string
  repo: string
  fetchImpl?: typeof fetch
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null
  now?: number
  ttlMs?: number
}): Promise<GithubReleasesResult> {
  const {
    owner,
    repo,
    fetchImpl = fetch,
    storage = null,
    now = Date.now(),
    ttlMs = DEFAULT_CACHE_TTL_MS,
  } = options
  const viewAllUrl = githubReleasesPageUrl(owner, repo)
  const key = githubReleasesCacheKey(owner, repo)
  const cached = storage ? readCachedReleases(storage, key) : null
  if (cached && isCacheFresh(cached, now, ttlMs)) {
    if (cached.releases.length === 0) {
      return {
        status: 'empty',
        releases: [],
        latest: undefined,
        recent: [],
        errorMessage: null,
        viewAllUrl,
      }
    }
    const { latest, recent } = splitLatestAndRecent(cached.releases)
    return {
      status: 'success',
      releases: cached.releases,
      latest,
      recent,
      errorMessage: null,
      viewAllUrl,
    }
  }

  try {
    const response = await fetchImpl(githubReleasesApiUrl(owner, repo), {
      headers: { Accept: 'application/vnd.github+json' },
    })

    if (!response.ok) {
      const rateLimited = isRateLimitStatus(response.status)
      if (cached?.releases.length) {
        const { latest, recent } = splitLatestAndRecent(cached.releases)
        return {
          status: 'stale',
          releases: cached.releases,
          latest,
          recent,
          errorMessage: rateLimited
            ? 'GitHub rate-limited the request. Showing a cached copy of recent releases.'
            : 'Could not refresh releases. Showing a cached copy.',
          viewAllUrl,
        }
      }
      return {
        status: 'error',
        releases: [],
        latest: undefined,
        recent: [],
        errorMessage: rateLimited
          ? 'GitHub is rate-limiting unauthenticated requests. Try again later, or open releases on GitHub.'
          : 'Could not load releases from GitHub. Open the releases page to download.',
        viewAllUrl,
      }
    }

    const payload = await response.json()
    const releases = normalizeReleases(payload)
    if (storage) {
      writeCachedReleases(storage, key, { fetchedAt: now, releases })
    }
    if (releases.length === 0) {
      return {
        status: 'empty',
        releases: [],
        latest: undefined,
        recent: [],
        errorMessage: null,
        viewAllUrl,
      }
    }
    const { latest, recent } = splitLatestAndRecent(releases)
    return {
      status: 'success',
      releases,
      latest,
      recent,
      errorMessage: null,
      viewAllUrl,
    }
  }
  catch {
    if (cached?.releases.length) {
      const { latest, recent } = splitLatestAndRecent(cached.releases)
      return {
        status: 'stale',
        releases: cached.releases,
        latest,
        recent,
        errorMessage: 'Network error while loading releases. Showing a cached copy.',
        viewAllUrl,
      }
    }
    return {
      status: 'error',
      releases: [],
      latest: undefined,
      recent: [],
      errorMessage: 'Network error while loading releases. Open the releases page to download.',
      viewAllUrl,
    }
  }
}

export function isCacheFresh(cache: CachedReleases, now: number, ttlMs = DEFAULT_CACHE_TTL_MS): boolean {
  return now - cache.fetchedAt < ttlMs
}
