import type { HomepageContent } from '~/data/homepage'

export function useHomepageHead(home: HomepageContent) {
  useHead({
    title: `${home.person.name} | ${home.person.role}`,
    meta: [
      {
        name: 'description',
        content: `${home.person.name} is an ${home.person.role} with ${home.person.experience} of experience. ${home.valueProposition}`,
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  })
}
