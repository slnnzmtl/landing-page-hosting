import type { HomepageContent } from '~/data/homepage'

export function useHomepageHead(home: HomepageContent) {
  useHead({
    title: `${home.person.name.text} | ${home.person.role.text}`,
    meta: [
      {
        name: 'description',
        content: `${home.person.name.text} is an ${home.person.role.text} with ${home.person.experience.text} of experience. ${home.valueProposition.text}`,
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  })
}
