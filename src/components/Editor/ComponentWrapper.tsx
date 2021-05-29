import { defineComponent, onMounted, ref, PropType, h, resolveComponent } from 'vue'
import { getStyle } from '@/utils/style'
import runAnimation from '@/utils/runAnimation'
import { JsonUnknown } from '@/components/FormCreator/interface'
import style from './index.module.scss'
export default defineComponent({
  props: {
    config: {
      type: Object as PropType<JsonUnknown>,
      require: true,
      default: () => ({})
    }
  },
  setup (props) {
    const rootEle = ref()

    onMounted(() => {
      runAnimation(rootEle.value as HTMLElement, props.config.animations)
    })

    const CurrentComponent = (props: JsonUnknown, children = '') => {
      return h(resolveComponent(props.is), props, children)
    }

    return () => (
      <div ref={rootEle}>
        <CurrentComponent
          class={style['wrap-component']}
          is={props.config.component}
          style={getStyle(props.config.style)}
          propValue={props.config.propValue}
          element={props.config}
        />
      </div>
    )
  }
})
