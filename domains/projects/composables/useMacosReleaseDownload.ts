import { useGithubReleases } from './useGithubReleases'
import { findMacosUniversalAsset, githubReleasesPageUrl } from '../utils/github-releases'

export function useMacosReleaseDownload(owner: string, repo: string) {
  const { result } = useGithubReleases(owner, repo)
  const releasesUrl = githubReleasesPageUrl(owner, repo)

  const macosAsset = computed(() => {
    if (!result.value.latest) return undefined
    return findMacosUniversalAsset(result.value.latest.assets)
  })

  function ctaHref(cta: { href: string, macosDownload?: boolean }) {
    if (cta.macosDownload && macosAsset.value) {
      return macosAsset.value.browserDownloadUrl
    }
    return cta.href
  }

  const versionLabel = computed(() => {
    const latest = result.value.latest
    if (!latest) {
      if (result.value.status === 'loading' || result.value.status === 'idle') {
        return 'Checking latest release…'
      }
      if (result.value.status === 'empty') {
        return 'No public release listed yet'
      }
      return 'See releases on GitHub'
    }
    return latest.tagName
  })

  const releaseDateLabel = computed(() => result.value.latest?.publishedLabel ?? '—')

  return {
    result,
    releasesUrl,
    macosAsset,
    ctaHref,
    versionLabel,
    releaseDateLabel,
  }
}
