/**
 * 公共工具函数
 */

import { JsonUnknown } from '@/components/FormCreator/interface'

export function deepCopy (target: any) {
  if (typeof target === 'object') {
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

export function $(selector: string) {
  return document.querySelector(selector)
}

export function swap(arr: JsonUnknown, i: string, j: any) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
