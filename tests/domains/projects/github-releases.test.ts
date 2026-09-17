import { describe, it, expect, vi } from 'vitest'
import {
  formatBytes,
  findMacosUniversalAsset,
  githubReleasesApiUrl,
  isAllowedGithubUrl,
  isRateLimitStatus,
  loadGithubReleases,
  normalizeReleases,
  readCachedReleases,
  releaseNotesToPlainText,
  writeCachedReleases,
  githubReleasesCacheKey,
} from '~/domains/projects/utils/github-releases'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const sampleRelease = {
  id: 1,
  tag_name: 'v1.2.0',
  name: 'v1.2.0',
  html_url: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases/tag/v1.2.0',
  published_at: '2026-09-09T13:02:20Z',
  prerelease: false,
  draft: false,
  body: '## 1.2.0\n\n- Output WAVs are [CDJ-safe](https://example.com).\n\n<img src="x.png">',
  assets: [
    {
      name: 'Rekordbox-WAV-Converter-macos-universal2.zip',
      size: 144335312,
      state: 'uploaded',
      browser_download_url: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases/download/v1.2.0/Rekordbox-WAV-Converter-macos-universal2.zip',
    },
  ],
}

describe('github release helpers', () => {
  it('builds the public unauthenticated API URL', () => {
    expect(githubReleasesApiUrl('slnnzmtl', 'rekordbox-playlist-converter')).toBe(
      'https://api.github.com/repos/slnnzmtl/rekordbox-playlist-converter/releases',
    )
  })

  it('selects the macOS universal2 zip for homepage download CTAs', () => {
    const [release] = normalizeReleases([sampleRelease])
    const asset = findMacosUniversalAsset(release.assets)
    expect(asset?.name).toBe('Rekordbox-WAV-Converter-macos-universal2.zip')
    expect(findMacosUniversalAsset([])).toBeUndefined()
  })

  it('formats byte sizes for humans', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(2048)).toBe('2 KB')
    expect(formatBytes(144335312)).toBe('138 MB')
  })

  it('strips markdown and HTML from release notes', () => {
    const text = releaseNotesToPlainText(sampleRelease.body)
    expect(text).not.toContain('<img')
    expect(text).not.toContain('https://example.com')
    expect(text).toContain('CDJ-safe')
  })

  it('drops drafts and keeps prereleases', () => {
    const releases = normalizeReleases([
      { ...sampleRelease, id: 2, draft: true, tag_name: 'v0.0.1' },
      { ...sampleRelease, id: 3, prerelease: true, tag_name: 'v1.3.0-beta', name: 'Beta' },
    ])
    expect(releases).toHaveLength(1)
    expect(releases[0].prerelease).toBe(true)
    expect(releases[0].tagName).toBe('v1.3.0-beta')
  })

  it('treats 403 and 429 as rate limits', () => {
    expect(isRateLimitStatus(403)).toBe(true)
    expect(isRateLimitStatus(429)).toBe(true)
    expect(isRateLimitStatus(500)).toBe(false)
  })

  it('allowlists only https GitHub download and release hosts', () => {
    expect(isAllowedGithubUrl(sampleRelease.html_url)).toBe(true)
    expect(isAllowedGithubUrl(sampleRelease.assets[0].browser_download_url)).toBe(true)
    expect(isAllowedGithubUrl('https://objects.githubusercontent.com/github-production-release-asset/1')).toBe(true)
    expect(isAllowedGithubUrl('javascript:alert(1)')).toBe(false)
    expect(isAllowedGithubUrl('https://evil.example/download')).toBe(false)
    expect(isAllowedGithubUrl('http://github.com/slnnzmtl/repo/releases')).toBe(false)
  })

  it('drops assets and releases with non-GitHub URLs', () => {
    const releases = normalizeReleases([
      {
        ...sampleRelease,
        html_url: 'javascript:alert(1)',
      },
      {
        ...sampleRelease,
        id: 9,
        assets: [
          {
            name: 'bad.zip',
            size: 10,
            state: 'uploaded',
            browser_download_url: 'https://evil.example/bad.zip',
          },
          sampleRelease.assets[0],
        ],
      },
    ])
    expect(releases).toHaveLength(1)
    expect(releases[0].assets).toHaveLength(1)
    expect(releases[0].assets[0].browserDownloadUrl).toBe(sampleRelease.assets[0].browser_download_url)
  })

  it('re-normalizes cached releases and strips poisoned URLs', () => {
    const storage = {
      store: new Map<string, string>(),
      getItem(key: string) {
        return this.store.get(key) ?? null
      },
      setItem(key: string, value: string) {
        this.store.set(key, value)
      },
    }
    const key = githubReleasesCacheKey('slnnzmtl', 'rekordbox-playlist-converter')
    storage.setItem(key, JSON.stringify({
      fetchedAt: 1,
      releases: [{
        id: 1,
        tagName: 'v1.2.0',
        name: 'v1.2.0',
        htmlUrl: 'javascript:alert(1)',
        publishedAt: '2026-09-09T13:02:20Z',
        publishedLabel: 'Sep 9, 2026',
        prerelease: false,
        notes: 'ok',
        assets: [{
          name: 'bad.zip',
          size: 1,
          sizeLabel: '1 B',
          browserDownloadUrl: 'https://evil.example/bad.zip',
        }],
      }],
    }))
    const cached = readCachedReleases(storage, key)
    expect(cached?.releases).toEqual([])
  })
})

describe('loadGithubReleases', () => {
  const owner = 'slnnzmtl'
  const repo = 'rekordbox-playlist-converter'

  it('returns the latest release and download URL on success', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([sampleRelease]))
    const result = await loadGithubReleases({ owner, repo, fetchImpl, storage: null })
    expect(result.status).toBe('success')
    expect(result.latest?.tagName).toBe('v1.2.0')
    expect(result.latest?.assets[0].browserDownloadUrl).toBe(sampleRelease.assets[0].browser_download_url)
    expect(result.latest?.notes).not.toContain('<img')
  })

  it('returns empty when GitHub lists no releases', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([]))
    const result = await loadGithubReleases({ owner, repo, fetchImpl, storage: null })
    expect(result.status).toBe('empty')
    expect(result.latest).toBeUndefined()
  })

  it('surfaces a rate-limit error without cache', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ message: 'API rate limit exceeded' }, 403))
    const result = await loadGithubReleases({ owner, repo, fetchImpl, storage: null })
    expect(result.status).toBe('error')
    expect(result.errorMessage).toMatch(/rate-limiting/i)
  })

  it('surfaces a network error without cache', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'))
    const result = await loadGithubReleases({ owner, repo, fetchImpl, storage: null })
    expect(result.status).toBe('error')
    expect(result.errorMessage).toMatch(/Network error/)
  })

  it('falls back to stale cache after a rate-limit', async () => {
    const storage = {
      store: new Map<string, string>(),
      getItem(key: string) {
        return this.store.get(key) ?? null
      },
      setItem(key: string, value: string) {
        this.store.set(key, value)
      },
    }
    const normalized = normalizeReleases([sampleRelease])
    writeCachedReleases(storage, githubReleasesCacheKey(owner, repo), {
      fetchedAt: 0,
      releases: normalized,
    })
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ message: 'API rate limit exceeded' }, 429))
    const result = await loadGithubReleases({
      owner,
      repo,
      fetchImpl,
      storage,
      now: 10_000_000,
      ttlMs: 1,
    })
    expect(result.status).toBe('stale')
    expect(result.latest?.tagName).toBe('v1.2.0')
    expect(result.errorMessage).toMatch(/cached copy/i)
  })

  it('keeps a prerelease badge when the latest build is a pre-release', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([
      { ...sampleRelease, prerelease: true, tag_name: 'v1.3.0-rc.1', name: 'RC' },
    ]))
    const result = await loadGithubReleases({ owner, repo, fetchImpl, storage: null })
    expect(result.latest?.prerelease).toBe(true)
    expect(result.latest?.name).toBe('RC')
  })

  it('still returns success when localStorage write fails', async () => {
    const storage = {
      getItem() {
        return null
      },
      setItem() {
        throw new DOMException('QuotaExceededError')
      },
    }
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([sampleRelease]))
    const result = await loadGithubReleases({ owner, repo, fetchImpl, storage })
    expect(result.status).toBe('success')
    expect(result.latest?.tagName).toBe('v1.2.0')
  })

  it('uses a short TTL for empty release caches', async () => {
    const storage = {
      store: new Map<string, string>(),
      getItem(key: string) {
        return this.store.get(key) ?? null
      },
      setItem(key: string, value: string) {
        this.store.set(key, value)
      },
    }
    writeCachedReleases(storage, githubReleasesCacheKey(owner, repo), {
      fetchedAt: 0,
      releases: [],
    })
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([sampleRelease]))
    const result = await loadGithubReleases({
      owner,
      repo,
      fetchImpl,
      storage,
      now: 6 * 60 * 1000,
      ttlMs: 60 * 60 * 1000,
      emptyTtlMs: 5 * 60 * 1000,
    })
    expect(fetchImpl).toHaveBeenCalled()
    expect(result.status).toBe('success')
    expect(result.latest?.tagName).toBe('v1.2.0')
  })
})
