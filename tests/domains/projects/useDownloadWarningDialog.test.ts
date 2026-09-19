import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDownloadWarningDialog } from '~/domains/projects/composables/useDownloadWarningDialog'

function clickEvent() {
  return {
    preventDefault: vi.fn(),
  } as unknown as MouseEvent
}

describe('useDownloadWarningDialog', () => {
  const openSpy = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('open', openSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    openSpy.mockReset()
  })

  it('calls onProceed without preventDefault when warning is off', () => {
    const onProceed = vi.fn()
    const { interceptClick, isOpen } = useDownloadWarningDialog({ onProceed })
    const event = clickEvent()

    interceptClick(event, 'https://example.com/app.zip', false)

    expect(onProceed).toHaveBeenCalledOnce()
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(isOpen.value).toBe(false)
    expect(openSpy).not.toHaveBeenCalled()
  })

  it('calls onProceed only after confirm when warning is on', () => {
    const onProceed = vi.fn()
    const { interceptClick, close, confirm, isOpen } = useDownloadWarningDialog({ onProceed })
    const event = clickEvent()
    const href = 'https://example.com/app.zip'

    interceptClick(event, href, true)

    expect(event.preventDefault).toHaveBeenCalledOnce()
    expect(isOpen.value).toBe(true)
    expect(onProceed).not.toHaveBeenCalled()

    close()
    expect(isOpen.value).toBe(false)
    expect(onProceed).not.toHaveBeenCalled()

    interceptClick(event, href, true)
    confirm()

    expect(onProceed).toHaveBeenCalledOnce()
    expect(openSpy).toHaveBeenCalledWith(href, '_blank', 'noopener,noreferrer')
    expect(isOpen.value).toBe(false)
  })
})
