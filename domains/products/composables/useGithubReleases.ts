import { onMounted, ref } from 'vue'
import {
  emptyGithubReleasesResult,
  loadGithubReleases,
  type GithubReleasesResult,
} from '../utils/github-releases'

export function useGithubReleases(owner: string, repo: string) {
  const result = ref<GithubReleasesResult>({
    ...emptyGithubReleasesResult(owner, repo),
    status: 'idle',
  })

  async function refresh() {
    result.value = {
      ...emptyGithubReleasesResult(owner, repo),
      status: 'loading',
    }
    result.value = await loadGithubReleases({
      owner,
      repo,
      storage: import.meta.client ? window.localStorage : null,
    })
  }

  onMounted(() => {
    void refresh()
  })

  return {
    result,
    refresh,
  }
}
