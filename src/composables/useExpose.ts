import { getCurrentInstance } from 'vue'

// expose public api
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useExpose (apis: Record<string, any>): void {
  const instance = getCurrentInstance()
  if (instance) {
    Object.assign(instance.proxy, apis)
  }
}