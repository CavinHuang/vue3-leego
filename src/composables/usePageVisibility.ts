import { ref, Ref } from 'vue'
import { inBrowser } from '@/utils/swiper'
import { useEventListener } from './useEventListener'

export function usePageVisibility ():Ref<VisibilityState> {
  const visibility = ref<VisibilityState>('visible')

  const setVisibility = () => {
    if (inBrowser) {
      visibility.value = document.hidden ? 'hidden' : 'visible'
    }
  }

  setVisibility()
  useEventListener('visibilitychange', setVisibility)

  return visibility
}
