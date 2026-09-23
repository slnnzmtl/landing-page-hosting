/** Shared image shape for gallery / lightbox primitives. */
export interface MediaImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  srcThumb?: string
  srcset?: string
  sizes?: string
}
