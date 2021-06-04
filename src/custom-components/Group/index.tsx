import { defineComponent, h, resolveComponent, PropType } from 'vue'
import { getStyle } from '@/utils/style'
import style from '../index.module.scss'
import { ComponentAttrType } from '@/types/sfc'
export default defineComponent({
  name: 'custom-group',
  props: {
    propValue: {
      type: Array as PropType<ComponentAttrType[]>,
      default: () => []
    },
    element: {
      type: Object as PropType<ComponentAttrType>
    }
  },
  setup (props) {
    const toPercent = (val: number) => {
      return val * 100 + '%'
    }

    const parentStyle = props.element!.style
    // eslint-disable-next-line
    props.propValue.forEach((component: any) => {
      // component.groupStyle 的 top left 是相对于 group 组件的位置
      // 如果已存在 component.groupStyle，说明已经计算过一次了。不需要再次计算
      if (!Object.keys(component.groupStyle).length) {
        const style = { ...component.style }
        component.groupStyle = getStyle(style)
        component.groupStyle.left = toPercent((style.left - parentStyle.left!) / parentStyle.width!)
        component.groupStyle.top = toPercent((style.top - parentStyle.top!) / parentStyle.height!)
        component.groupStyle.width = toPercent(style.width / parentStyle.width!)
        component.groupStyle.height = toPercent(style.height / parentStyle.height!)
      }
    })
    // eslint-disable-next-line
    const CurrentComponent = (props: any, children: any = '') => {
      return h(resolveComponent(props.is), props, children)
    }

    return () => (
      <div class={[style.group]}>
        <div>
          {props.propValue.map(item => {
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
