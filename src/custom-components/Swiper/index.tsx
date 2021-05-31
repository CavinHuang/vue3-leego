import { defineComponent, PropType, computed, ref } from 'vue'
import Swiper from './Swiper'
import SwiperItem from './SwipeItem'
import {ComponentAttrType, SfcStyleType} from '@/types/sfc'
import { JsonUnknown } from '@/components/FormCreator/interface'
import { useStore } from '@/store'
import eventBus from '@/utils/eventBus'

export default defineComponent({
  name: 'customer-swiper',
  props: {
    element: {
      type: Object as PropType<ComponentAttrType>,
      required: true
    },
    showIndicators: {
      type: Boolean,
      default: true
    },
    vertical: Boolean,
    indicatorColor: String
  },
  setup (props, { attrs }) {
    const store = useStore()
    const elements = props.element
    const values = elements.propValue as Array<JsonUnknown>
    const curComponent = computed(() => store.state.canvas.curComponent)
    const swipeInstance = ref<any>(null)

    eventBus.$on<SfcStyleType>('updateFormData', (style) => {
      if (curComponent.value && curComponent.value.component === 'Swiper') {
        swipeInstance.value?.resize()
      }
    })

    return () => (
      <Swiper ref={swipeInstance} showIndicators={props.showIndicators} vertical={props.vertical} indicatorColor={props.indicatorColor} >
        {values.map(element => {
          return (
            <SwiperItem>
              <div class='swipe-content'>
                <div class='swipe-image'>
                  <img src={element.src} alt={element.title || ''} />
                </div>
                {element.title ? <div class='swipe-title'>{element.title}</div>: ''}
              </div>
            </SwiperItem>
          )
        })}
      </Swiper>
    )
  }
})
