import type { InjectionKey } from 'vue'
import type { CaseImage } from '../data/types'

export type OpenCaseLightbox = (images: CaseImage[], index: number) => void

export const openCaseLightboxKey: InjectionKey<OpenCaseLightbox> = Symbol('openCaseLightbox')
