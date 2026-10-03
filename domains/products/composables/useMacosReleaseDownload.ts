import { useGithubReleases } from './useGithubReleases'
import {
  findMacosUniversalAsset,
  formatGithubReleaseVersionLabel,
  githubReleasesPageUrl,
} from '../utils/github-releases'

export function useMacosReleaseDownload(
  owner: string,
  repo: string,
) {
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

  const versionLabel = computed(() =>
    formatGithubReleaseVersionLabel(result.value),
  )

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
