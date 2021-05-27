import { defineComponent, reactive, computed, h, resolveComponent, onMounted, ref } from 'vue'
import Grid from './Grid'
import Area from './Area'
import Shape from './Shape'
import MarkLine from './MarkLine'
import ContextMenu from './ContextMenu'
import { AreaInfoType, PointType } from './interface'
import { useStore } from '@/store'
import { changeStyleWithScale } from '@/utils/translate'
import { getStyle, getComponentRotatedStyle } from '@/utils/style'
import style from './index.module.scss'
import { JsonUnknown } from '@/components/FormCreator/interface'
import eventBus from '@/utils/eventBus'
import { $ } from '@/utils'
export default defineComponent({
  name: 'Editor',
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const store = useStore()
    const canvasStyleData = computed(() => store.state.canvas.canvasStyleData)
    const componentData = computed(() => store.state.canvas.componentData)
    const curComponent = computed(() => store.state.canvas.curComponent)
    const editor = computed(() => store.state.canvas.editor)
    const editorX = ref(0)
    const editorY = ref(0)
    const start = reactive<PointType>({
      x: 0,
      y: 0
    })

    const areaInfo = reactive<AreaInfoType>({
      width: 0,
      height: 0,
      isShowArea: false
    })

    onMounted(() => {
      store.dispatch('canvas/getEditor')
      eventBus.$on('hideArea', () => {
        hideArea()
      })
    })

    const hideArea = () => {
      areaInfo.isShowArea = false
      areaInfo.width = 0
      areaInfo.height = 0
  }

    const handleContextMenu = (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      // 计算菜单相对于编辑器的位移
      let target: any = e.target
      let top = e.offsetY
      let left = e.offsetX
      while (target instanceof SVGElement) {
        target = target.parentNode
      }

      while (!target.className.includes('editor')) {
        left += target.offsetLeft
        top += target.offsetTop
        target = target.parentNode
      }

      store.dispatch('contextMenu/showContextMenu', { top, left })
    }

    const handleMouseDown = (e: MouseEvent) => {
      // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
      if (!curComponent.value || (curComponent.value.component != 'v-text' && curComponent.value.component != 'rect-shape')) {
        e.preventDefault()
      }

      hideArea()

      // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
      const rectInfo = editor.value?.getBoundingClientRect()
      editorX.value = rectInfo ? rectInfo.x : 0
      editorY.value = rectInfo ? rectInfo.y : 0

      const startX = e.clientX
      const startY = e.clientY
      start.x = startX - editorX.value
      start.y = startY - editorY.value
      // 展示选中区域
      areaInfo.isShowArea = true

      const move = (moveEvent: MouseEvent) => {
        console.log(moveEvent.clientX, startX)
        areaInfo.width = Math.abs(moveEvent.clientX - startX)
        areaInfo.height = Math.abs(moveEvent.clientY - startY)
        if (moveEvent.clientX < startX) {
          start.x = moveEvent.clientX - editorX.value
        }

        if (moveEvent.clientY < startY) {
          start.y = moveEvent.clientY - editorY.value
        }
      }

      const up = (e: MouseEvent) => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)

        if (e.clientX == startX && e.clientY == startY) {
          hideArea()
          return
        }
        createGroup()
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }

    const getSelectArea = (): Array<JsonUnknown> => {
      const result: any = []
      // 区域起点坐标
      const { x, y } = start
      // 计算所有的组件数据，判断是否在选中区域内
      componentData.value.forEach(component => {
        if (component.isLock) return

        const { left, top, width: cWidth, height: cHeight } = component.style
        if (x <= left && y <= top && (left + cWidth <= x + areaInfo.width) && (top + cHeight <= y + areaInfo.height)) {
          result.push(component)
        }
      })

      // 返回在选中区域内的所有组件
      return result
    }

    const createGroup = () => {
      // 获取选中区域的组件数据
      const areaData = getSelectArea()
      if (areaData.length <= 1) {
        hideArea()
        return
      }

      // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
      // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
      let top = Infinity, left = Infinity
      let right = -Infinity, bottom = -Infinity
      areaData.forEach(component => {
        let style: JsonUnknown = {}
        if (component.component == 'Group') {
          component.propValue.forEach((item: any) => {
            const rectInfo = $(`#component${item.id}`)?.getBoundingClientRect()
            if (rectInfo) {
              style.left = rectInfo.left - editorX.value
              style.top = rectInfo.top - editorY.value
              style.right = rectInfo.right - editorX.value
              style.bottom = rectInfo.bottom - editorY.value

              if (style.left < left) left = style.left
              if (style.top < top) top = style.top
              if (style.right > right) right = style.right
              if (style.bottom > bottom) bottom = style.bottom
            }
          })
        } else {
          style = getComponentRotatedStyle(component.style)
        }

        if (style.left < left) left = style.left
        if (style.top < top) top = style.top
        if (style.right > right) right = style.right
        if (style.bottom > bottom) bottom = style.bottom
      })

      start.x = left
      start.y = top
      areaInfo.width = right - left
      areaInfo.height = bottom - top

      // 设置选中区域位移大小信息和区域内的组件数据
      store.dispatch('canvas/setAreaData', {
        style: {
          left,
          top,
          width: areaInfo.width,
          height: areaInfo.height,
        },
        components: areaData,
      })
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
        class={{ [style.editor]: true, [style.edit]: props.isEdit }}
        style={{
          width: changeStyleWithScale(canvasStyleData.value.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.value.height) + 'px'
        }}
        onContextmenu={(e: MouseEvent) => handleContextMenu(e)}
        onMousedown={(e: MouseEvent) => handleMouseDown(e)}
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
                  class={style['edit-component']}
                  is={item.component}
                  style={getComponentStyle(item.style)}
                  propValue={item.propValue}
                  element={item}
                  id={'component' + item.id}
                />
                :<CurrentComponent
                  class={style['edit-component']}
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
        <ContextMenu />
        <MarkLine />
        <Area start={start} width={areaInfo.width} height={areaInfo.height} v-show={areaInfo.isShowArea} />
      </div>
    )
  }
})
