export function selectContactHash(input: {
  top: number
  bottom: number
  scrollY: number
  viewportHeight: number
  documentHeight: number
  contactActive: boolean
}): '#contact' | '' {
  const { top, bottom, scrollY, viewportHeight, documentHeight, contactActive } = input
  const viewportBottom = scrollY + viewportHeight
  const nearBottom = viewportBottom >= documentHeight - 64
  const visible = bottom > scrollY && top < viewportBottom
  const viewportTop = top - scrollY

  if (contactActive) {
    if (nearBottom || (visible && viewportTop <= viewportHeight * 0.94)) return '#contact'
    return ''
  }
  if (nearBottom || (visible && viewportTop <= viewportHeight * 0.85)) return '#contact'
  return ''
}
