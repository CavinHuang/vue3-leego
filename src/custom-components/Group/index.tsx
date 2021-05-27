import {defineComponent, h, onBeforeUnmount, resolveComponent} from 'vue'
import { getStyle } from '@/utils/style'
import style from '../index.module.scss'
export default defineComponent({
  name: 'custom-group',
  props: {
    propValue: {
      type: Array,
      default: () => []
    },
    element: {
      type: Object
    }
  },
  setup (props) {
    const toPercent = (val: number) => {
      return val * 100 + '%'
    }

    const parentStyle = props.element?.style
    props.propValue.forEach((component: any) => {
      // component.groupStyle 的 top left 是相对于 group 组件的位置
      // 如果已存在 component.groupStyle，说明已经计算过一次了。不需要再次计算
      if (!Object.keys(component.groupStyle).length) {
        // @ts-ignore
        const style = { ...component.style }
        // @ts-ignore
        component.groupStyle = getStyle(style)
        // @ts-ignore
        component.groupStyle.left = toPercent((style.left - parentStyle.left) / parentStyle.width)
        // @ts-ignore
        component.groupStyle.top = toPercent((style.top - parentStyle.top) / parentStyle.height)
        // @ts-ignore
        component.groupStyle.width = toPercent(style.width / parentStyle.width)
        // @ts-ignore
        component.groupStyle.height = toPercent(style.height / parentStyle.height)
      }
    })

    const CurrentComponent = (props: any, children: any = '') => {
      return h(resolveComponent(props.is), props, children)
    }

    return () => (
      <div class={[style.group]}>
        <div>
          {props.propValue.map((item: any) => {
            return (
              <CurrentComponent
                class="component"
                is={item.component}
                style={item.groupStyle}
                propValue={item.propValue}
                id={'component' + item.id}
                element={item}
              />
            )
          })}
        </div>
      </div>
    )
  }
})
