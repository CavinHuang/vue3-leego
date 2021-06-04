import { nextTick, onMounted, onActivated } from 'vue'
// eslint-disable-next-line
export function onMountedOrActivated (hook: () => any): void {
  let mounted: boolean

  onMounted(() => {
    hook()
    nextTick(() => {
      mounted = true
    })
  })

  onActivated(() => {
    if (mounted) {
      hook()
    }
  })
}
