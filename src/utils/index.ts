/**
 * 公共工具函数
 */

import { JsonUnknown } from '@/components/FormCreator/interface'
// eslint-disable-next-line
export function deepCopy (target: any): any {
  if (typeof target === 'object') {
    // eslint-disable-next-line
    const result: any = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (typeof target[key] === 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }
    return result
  }
  return target
}

export function $ (selector: string):(HTMLElement | null) {
  return document.querySelector<HTMLElement>(selector)
}

export function swap (arr: JsonUnknown, i: number, j: number):void {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
