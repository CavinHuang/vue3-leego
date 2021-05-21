import { defineComponent, ref, reactive, onMounted, nextTick } from 'vue'
import { useStore } from '@/store'
import { mod360 } from '@/utils/translate'
import { JsonUnknown } from '@/components/FormCreator/interface'
import style from './index.module.scss'
interface InitAngleType {
  [key: string]: number
}

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false
    },
    element: {
      require: true,
      type: Object
    },
    defaultStyle: {
      require: true,
      type: Object
    },
    index: {
      require: true,
      type: [Number, String]
    }
  },
  setup (props, context) {
    const store = useStore()
    const $el = ref<HTMLDivElement | null>(null)
    const active = ref(false)
    const state = reactive({
      pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'], // 八个方向
      initialAngle: { // 每个点对应的初始角度
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315
      } as InitAngleType,
      angleToCursor: [ // 每个范围的角度对应的光标
        { start: 338, end: 23, cursor: 'nw' },
        { start: 23, end: 68, cursor: 'n' },
        { start: 68, end: 113, cursor: 'ne' },
        { start: 113, end: 158, cursor: 'e' },
        { start: 158, end: 203, cursor: 'se' },
        { start: 203, end: 248, cursor: 's' },
        { start: 248, end: 293, cursor: 'sw' },
        { start: 293, end: 338, cursor: 'w' }
      ],
      cursors: {}
    })
    const curComponent = store.state.canvas.curComponent
    const editor = store.state.canvas.editor

    const selectCurComponent = (e: MouseEvent) => {
      // 阻止向父组件冒泡
      e.stopPropagation()
      e.preventDefault()
      // this.$store.commit('hideContextMenu')
    }
    const handleMouseDownOnShape = (e: MouseEvent) => {
      store.dispatch('canvas/setClickComponentStatus', true)
      if (props.element?.component != 'v-text' && props.element?.component != 'rect-shape') {
        e.preventDefault()
      }

      e.stopPropagation()
      store.dispatch('canvas/setCurComponent', { component: props.element, index: props.index })
      if (props.element?.isLock) return

      state.cursors = getCursor() // 根据旋转角度获取光标位置

      const pos:any = { ...props.defaultStyle }
      const startY = e.clientY
      const startX = e.clientX
      // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
      const startTop = Number(pos.top)
      const startLeft = Number(pos.left)

      // 如果元素没有移动，则不保存快照
      let hasMove = false
      const move = (moveEvent: MouseEvent) => {
        hasMove = true
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        pos.top = curY - startY + startTop
        pos.left = curX - startX + startLeft

        // 修改当前组件样式
        store.dispatch('snapshot/setShapeStyle', pos)
        // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
        // 如果不使用 $nextTick，吸附后将无法移动
        nextTick(() => {
          // 触发元素移动事件，用于显示标线、吸附功能
          // 后面两个参数代表鼠标移动方向
          // curY - startY > 0 true 表示向下移动 false 表示向上移动
          // curX - startX > 0 true 表示向右移动 false 表示向左移动
          // eventBus.$emit('move', curY - startY > 0, curX - startX > 0)
        })
      }

      const up = () => {
        hasMove && store.dispatch('snapshot/recordSnapshot')
        // 触发元素停止移动事件，用于隐藏标线
        // eventBus.$emit('unmove')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }
    const handleRotate = (e: MouseEvent) => {
      store.dispatch('canvas/setClickComponentStatus', true)
      e.preventDefault()
      e.stopPropagation()
      // 初始坐标和初始角度
      const pos = { ...props.defaultStyle }
      const startY = e.clientY
      const startX = e.clientX
      const startRotate = (pos as any).rotate

      // 获取元素中心点位置
      const rect = $el.value?.getBoundingClientRect()
      const left = rect?.left || 0
      const width = rect?.width || 0
      const height = rect?.height || 0
      const top = rect?.top || 0
      const centerX = left | + width / 2
      const centerY = top + height / 2

      // 旋转前的角度
      const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

      // 如果元素没有移动，则不保存快照
      let hasMove = false

      const move = (moveEvent: MouseEvent) => {
        hasMove = true
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        // 旋转后的角度
        const rotateDegreeAfter = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)
        // 获取旋转的角度值
        ;(pos as any).rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore
        // 修改当前组件样式
        store.dispatch('snapshot/setShapeStyle', pos)
      }

      const up = () => {
        hasMove && store.dispatch('snapshot/recordSnapshot')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        state.cursors = getCursor() // 根据旋转角度获取光标位置
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)

    }
    const getPointStyle = (point: any) => {
      const { width, height } = props.defaultStyle as any
      const hasT = /t/.test(point)
      const hasB = /b/.test(point)
      const hasL = /l/.test(point)
      const hasR = /r/.test(point)
      let newLeft = 0
      let newTop = 0

      // 四个角的点
      if (point.length === 2) {
        newLeft = hasL ? 0 : width
        newTop = hasT ? 0 : height
      } else {
        // 上下两点的点，宽度居中
        if (hasT || hasB) {
          newLeft = width / 2
          newTop = hasT ? 0 : height
        }

        // 左右两边的点，高度居中
        if (hasL || hasR) {
          newLeft = hasL ? 0 : width
          newTop = Math.floor(height / 2)
        }
      }

      const style = {
        marginLeft: hasR ? '-4px' : '-4px',
        marginTop: '-4px',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        cursor: (state.cursors as any)[point]
      }
      return style
    }
    const handleMouseDownOnPoint = (item: any, e: MouseEvent) => {}
    const isActive = () => active.value && !props.element?.isLock
    const getCursor = () => {
      const { angleToCursor, initialAngle, pointList } = state
      const rotate = mod360(curComponent?.style.rotate) // 取余 360
      const result: JsonUnknown = {}
      let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度

      pointList.forEach(point => {
        const initDeg: number = initialAngle[point]
        const angle = mod360(initDeg + rotate)
        const len = angleToCursor.length
        while (true) {
          lastMatchIndex = (lastMatchIndex + 1) % len
          const angleLimit = angleToCursor[lastMatchIndex]
          if (angle < 23 || angle >= 338) {
            result[point] = 'nw-resize'
            return
          }
          if (angleLimit.start <= angle && angle < angleLimit.end) {
            result[point] = angleLimit.cursor + '-resize'
            return
          }
        }
      })

      return result
    }

    onMounted(() => {
      if (curComponent) {
        state.cursors = getCursor()
      }

      // 触发动画
    })

    return () => (
      <div class={{ [style['shape']]: true, active: active }}  onClick={(e: MouseEvent) => selectCurComponent(e)} onMousedown={(e: MouseEvent) => handleMouseDownOnShape(e)} ref={$el}>
        <span class="iconfont icon-xiangyouxuanzhuan" v-show={isActive()} onMousedown={(e: MouseEvent) => handleRotate(e)} />
        <span class="iconfont icon-suo" v-show="element.isLock" />
        {state.pointList.map(item => {
          return <div class="shape-point" onMousedown={($event) => handleMouseDownOnPoint(item, $event)} key="item" style={getPointStyle(item)} />
        })}
        <slot />
      </div>
    )
  }
})
