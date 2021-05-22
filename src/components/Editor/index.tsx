import { defineComponent, reactive, computed, h, resolveComponent } from 'vue'
import Grid from './Grid'
import Area from './Area'
import Shape from './Shape'
import { AreaInfoType, PointType } from './interface'
import { useStore } from '@/store'
import { changeStyleWithScale } from '@/utils/translate'
import { getStyle } from '@/utils/style'
import style from './index.module.scss'
import { JsonUnknown } from '@/components/FormCreator/interface'
export default defineComponent({
  name: 'Editor',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const store = useStore()
    const canvasStyleData = computed(() => store.state.canvas.canvasStyleData)
    const componentData = computed(() => store.state.canvas.componentData)
    const curComponent = computed(() => store.state.canvas.curComponent)

    const start = reactive<PointType>({
      x: 0,
      y: 0
    })

    const areaInfo = reactive<AreaInfoType>({
      width: 0,
      height: 0,
      isShowArea: false
    })

    const handleContextMenu = () => {
      console.log('右键')
    }

    const handleMouseDown = () => {
      console.log('鼠标按下')
    }

    const getShapeStyle = (style: JsonUnknown) => {
      const result: JsonUnknown = {};
      ['width', 'height', 'top', 'left', 'rotate'].forEach(attr => {
        if (attr !== 'rotate') {
          result[attr] = style[attr] + 'px'
        } else {
          result.transform = 'rotate(' + style[attr] + 'deg)'
        }
      })
      return result
    }

    const getComponentStyle = (style: JsonUnknown) => {
      return getStyle(style, ['top', 'left', 'width', 'height', 'rotate'])
    }

    const getTextareaHeight = (element: JsonUnknown, text: string) => {
      let { lineHeight, fontSize, height } = element.style
      if (lineHeight === '') {
        lineHeight = 1.5
      }

      const newHeight = (text.split('<br>').length - 1) * lineHeight * fontSize
      return height > newHeight ? height : newHeight
    }

    const handleInput = (element: JsonUnknown, value: string) => {
      // 根据文本组件高度调整 shape 高度
      store.dispatch('snapshot/setShapeStyle', { height: getTextareaHeight(element, value) })
    }

    const CurrentComponent = (props: any, children: any = '') => {
      return h(resolveComponent(props.is), props, children)
    }

    return () => (
      <div
        id="editor"
        class={{ [style.editor]: true, edit: props.isEdit }}
        style={{
          width: changeStyleWithScale(canvasStyleData.value.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.value.height) + 'px'
        }}
        onContextmenu={() => handleContextMenu()}
        onMousedown={() => handleMouseDown()}
      >
        <Grid />
        {componentData.value.map((item, index) => {
          return (
            <Shape
              defaultStyle={item.style}
              style={getShapeStyle(item.style)}
              key="item.id"
              active={item === curComponent.value}
              element={item}
              index={index}
              class={{ lock: item.isLock }}
            >
              { item.component !== 'v-text'
                ? <CurrentComponent
                  class="component"
                  is={item.component}
                  style={getComponentStyle(item.style)}
                  propValue={item.propValue}
                  element={item}
                  id={'component' + item.id}
                />
                : <CurrentComponent
                  class="component"
                  is={item.component}
                  style={getComponentStyle(item.style)}
                  propValue={item.propValue}
                  input={handleInput}
                  element={item}
                  id={'component' + item.id}
                />
              }
            </Shape>
          )
        })}
        <Area start={start} width={areaInfo.width} height={areaInfo.height} v-show={areaInfo.isShowArea} />
      </div>
    )
  }
})
