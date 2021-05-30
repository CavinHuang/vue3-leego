import { unref, Ref } from 'vue'

export const truthProp = {
  type: Boolean,
  default: true as const
}

export function isHidden (elementRef: HTMLElement | Ref<HTMLElement | undefined>): boolean {
  const el = unref(elementRef)
  if (!el) {
    return false
  }

  const style = window.getComputedStyle(el)
  const hidden = style.display === 'none'

  // offsetParent returns null in the following situations:
  // 1. The element or its parent element has the display property set to none.
  // 2. The element has the position property set to fixed
  const parentHidden = el.offsetParent === null && style.position !== 'fixed'

  return hidden || parentHidden
}

export function stopPropagation (event: Event): void {
  event.stopPropagation()
}

export function preventDefault (event: Event, isStopPropagation?: boolean): void {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault()
  }

  if (isStopPropagation) {
    stopPropagation(event)
  }
}

export function range (num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

export const inBrowser = typeof window !== 'undefined'

const root = (inBrowser ? window : global) as Window

let prev = Date.now()

function rafPolyfill (fn: FrameRequestCallback): number {
  const curr = Date.now()
  const ms = Math.max(0, 16 - (curr - prev))
  const id = setTimeout(fn, ms)
  prev = curr + ms
  return id
}

export function raf (fn: FrameRequestCallback): number {
  const requestAnimationFrame = root.requestAnimationFrame || rafPolyfill
  return requestAnimationFrame.call(root, fn)
}

export function cancelRaf (id: number): void {
  const cancelAnimationFrame = root.cancelAnimationFrame || root.clearTimeout
  cancelAnimationFrame.call(root, id)
}

// double raf for animation
export function doubleRaf (fn: FrameRequestCallback): void {
  raf(() => raf(fn))
}
