import { ComponentInternalInstance, computed, defineComponent, onBeforeUpdate, onMounted, reactive, ref, watchEffect } from 'vue'
import eventBus from '@/utils/eventBus'
import { useStore } from '@/store'
import { getComponentRotatedStyle } from '@/utils/style'
import style from './index.module.scss'

type LinesType = 'xt' | 'xc' | 'xb' | 'yl' | 'yc' | 'yr'
type ConditionItem = {
  isNearly: boolean
  lineNode: HTMLElement // xt
  line: LinesType
  dragShift: number,
  lineShift: number
}

type ConditionType = {
  top: ConditionItem[]
  left: ConditionItem[]
}

type ConditionKey = keyof ConditionType

export default defineComponent({
  name: 'MarkLine',
  setup () {
    const store = useStore()
    const lines = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr']
    const diff = 3
    const linesRef = reactive<any>({
      xt: null,
      xc: null,
      xb: null,
      yl: null,
      yc: null,
      yr: null
    })
    const lineStatus = reactive<any>({
      xt: false,
      xc: false,
      xb: false,
      yl: false,
      yc: false,
      yr: false
    })
    const curComponent = computed(() => store.state.canvas.curComponent)
    const componentData = computed(() => store.state.canvas.componentData)

    const hideLine = () => {
      Object.keys(lineStatus).forEach((line) => {
        lineStatus[line] = false
      })
    }

    const showLine = (isDownward: boolean, isRightward: boolean) => {
      const lines = linesRef
      const components = componentData.value
      const style = curComponent.value ? curComponent.value.style : {}
      const curComponentStyle = getComponentRotatedStyle(style)
      const curComponentHalfwidth = curComponentStyle.width / 2
      const curComponentHalfHeight = curComponentStyle.height / 2

      hideLine()
      components.forEach((component: any) => {
        if (component === curComponent.value) return
        const componentStyle = getComponentRotatedStyle(component.style)
        const { top, left, bottom, right } = componentStyle
        const componentHalfwidth = componentStyle.width / 2
        const componentHalfHeight = componentStyle.height / 2

        const conditions: ConditionType = {
          top: [
            {
              isNearly: isNearly(curComponentStyle.top, top),
              lineNode: lines.xt, // xt
              line: 'xt',
              dragShift: top,
              lineShift: top
            },
            {
              isNearly: isNearly(curComponentStyle.bottom, top),
              lineNode: lines.xt, // xt
              line: 'xt',
              dragShift: top - curComponentStyle.height,
              lineShift: top
            },
            {
              // 组件与拖拽节点的中间是否对齐
              isNearly: isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
              lineNode: lines.xc, // xc
              line: 'xc',
              dragShift: top + componentHalfHeight - curComponentHalfHeight,
              lineShift: top + componentHalfHeight
            },
            {
              isNearly: isNearly(curComponentStyle.top, bottom),
              lineNode: lines.xb, // xb
              line: 'xb',
              dragShift: bottom,
              lineShift: bottom
            },
            {
              isNearly: isNearly(curComponentStyle.bottom, bottom),
              lineNode: lines.xb, // xb
              line: 'xb',
              dragShift: bottom - curComponentStyle.height,
              lineShift: bottom
            }
          ],
          left: [
            {
              isNearly: isNearly(curComponentStyle.left, left),
              lineNode: lines.yl, // yl
              line: 'yl',
              dragShift: left,
              lineShift: left
            },
            {
              isNearly: isNearly(curComponentStyle.right, left),
              lineNode: lines.yl, // yl
              line: 'yl',
              dragShift: left - curComponentStyle.width,
              lineShift: left
            },
            {
              // 组件与拖拽节点的中间是否对齐
              isNearly: isNearly(curComponentStyle.left + curComponentHalfwidth, left + componentHalfwidth),
              lineNode: lines.yc, // yc
              line: 'yc',
              dragShift: left + componentHalfwidth - curComponentHalfwidth,
              lineShift: left + componentHalfwidth
            },
            {
              isNearly: isNearly(curComponentStyle.left, right),
              lineNode: lines.yr, // yr
              line: 'yr',
              dragShift: right,
              lineShift: right
            },
            {
              isNearly: isNearly(curComponentStyle.right, right),
              lineNode: lines.yr, // yr
              line: 'yr',
              dragShift: right - curComponentStyle.width,
              lineShift: right
            }
          ]
        }

        const needToShow: any = []
        let rotate = 0
        if (curComponent.value) {
          rotate = curComponent.value.style.width || 0
        }
        (Object.keys(conditions) as Array<ConditionKey>).forEach(key => {
          // 遍历符合的条件并处理
          conditions[key].forEach(condition => {
            if (!condition.isNearly) return
            // 修改当前组件位移
            store.dispatch('canvas/setShapeSingleStyle', {
              key,
              value: rotate !== 0 ? translatecurComponentShift(key, condition, curComponentStyle) : condition.dragShift
            })

            condition.lineNode.style[key] = `${condition.lineShift}px`
            needToShow.push(condition.line)
          })
        })

        // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
        // 同一方向上的线只显示一条，例如多条横条只显示一条横线
        if (needToShow.length) {
          chooseTheTureLine(needToShow, isDownward, isRightward)
        }
      })
    }

    const translatecurComponentShift = (key: any, condition: any, curComponentStyle: any) => {
      let width = 0
      let height = 0
      if (curComponent.value) {
        width = curComponent.value.style.width || 0
        height = curComponent.value.style.height || 0
      }
      if (key === 'top') {
        return Math.round(condition.dragShift - (height - curComponentStyle.height) / 2)
      }

      return Math.round(condition.dragShift - (width - curComponentStyle.width) / 2)
    }

    const chooseTheTureLine = (needToShow: any, isDownward: boolean, isRightward: boolean) => {
      // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
      // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
      if (isRightward) {
        if (needToShow.includes('yr')) {
          lineStatus.yr = true
        } else if (needToShow.includes('yc')) {
          lineStatus.yc = true
        } else if (needToShow.includes('yl')) {
          lineStatus.yl = true
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (needToShow.includes('yl')) {
          lineStatus.yl = true
        } else if (needToShow.includes('yc')) {
          lineStatus.yc = true
        } else if (needToShow.includes('yr')) {
          lineStatus.yr = true
        }
      }

      if (isDownward) {
        if (needToShow.includes('xb')) {
          lineStatus.xb = true
        } else if (needToShow.includes('xc')) {
          lineStatus.xc = true
        } else if (needToShow.includes('xt')) {
          lineStatus.xt = true
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (needToShow.includes('xt')) {
          lineStatus.xt = true
        } else if (needToShow.includes('xc')) {
          lineStatus.xc = true
        } else if (needToShow.includes('xb')) {
          lineStatus.xb = true
        }
      }
    }

    const isNearly = (dragValue: number, targetValue: number) => {
      return Math.abs(dragValue - targetValue) <= diff
    }

    onMounted(() => {
      // 监听元素移动和不移动的事件
      eventBus.$on('move', (isDownward, isRightward) => {
        showLine(isDownward, isRightward)
      })

      eventBus.$on('unmove', () => {
        hideLine()
      })
    })

    onBeforeUpdate(() => {
      linesRef.value = []
    })

    return () => (
      <div class={style['mark-line']}>
        {lines.map((line, index) => {
          return (
            <div
              key={line}
              class={['line', line.includes('x') ? 'xline' : 'yline']}
              ref={ (el: Element | ComponentInternalInstance | null) => {
                if (el) {
                  linesRef[line] = el
                }
              }}
              v-show={lineStatus[line] || false}
            />
          )
        })}
      </div>
    )
  }
})
