import { ComponentInternalInstance, computed, defineComponent, onBeforeUpdate, onMounted, reactive } from 'vue'
import eventBus from '@/utils/eventBus'
import { useStore } from '@/store'
import { getComponentRotatedStyle } from '@/utils/style'
import style from './index.module.scss'
import { SfcStyleType } from '@/types/sfc'

type LinesType = 'xt' | 'xc' | 'xb' | 'yl' | 'yc' | 'yr'
type refEle = Element | null | ComponentInternalInstance
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

type LineSatusType = {
  [key in LinesType]: boolean
}

type LinesRefType = {
  [key in LinesType]: refEle
}

export default defineComponent({
  name: 'MarkLine',
  setup () {
    const store = useStore()
    const lines: LinesType[] = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr']
    const diff = 3
    const linesRef = reactive<LinesRefType>({
      xt: null,
      xc: null,
      xb: null,
      yl: null,
      yc: null,
      yr: null
    })
    const lineStatus = reactive<LineSatusType>({
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
      (Object.keys(lineStatus) as LinesType[]).forEach((line) => {
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
      components.forEach(component => {
        if (component === curComponent.value) return
        const componentStyle = getComponentRotatedStyle(component.style)
        const { top, left, bottom, right } = componentStyle
        const componentHalfwidth = componentStyle.width / 2
        const componentHalfHeight = componentStyle.height / 2

        const conditions: ConditionType = {
          top: [
            {
              isNearly: isNearly(curComponentStyle.top, top),
              lineNode: lines.xt as HTMLElement, // xt
              line: 'xt',
              dragShift: top,
              lineShift: top
            },
            {
              isNearly: isNearly(curComponentStyle.bottom, top),
              lineNode: lines.xt as HTMLElement, // xt
              line: 'xt',
              dragShift: top - curComponentStyle.height,
              lineShift: top
            },
            {
              // ??????????????????????????????????????????
              isNearly: isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
              lineNode: lines.xc as HTMLElement, // xc
              line: 'xc',
              dragShift: top + componentHalfHeight - curComponentHalfHeight,
              lineShift: top + componentHalfHeight
            },
            {
              isNearly: isNearly(curComponentStyle.top, bottom),
              lineNode: lines.xb as HTMLElement, // xb
              line: 'xb',
              dragShift: bottom,
              lineShift: bottom
            },
            {
              isNearly: isNearly(curComponentStyle.bottom, bottom),
              lineNode: lines.xb as HTMLElement, // xb
              line: 'xb',
              dragShift: bottom - curComponentStyle.height,
              lineShift: bottom
            }
          ],
          left: [
            {
              isNearly: isNearly(curComponentStyle.left, left),
              lineNode: lines.yl as HTMLElement, // yl
              line: 'yl',
              dragShift: left,
              lineShift: left
            },
            {
              isNearly: isNearly(curComponentStyle.right, left),
              lineNode: lines.yl as HTMLElement, // yl
              line: 'yl',
              dragShift: left - curComponentStyle.width,
              lineShift: left
            },
            {
              // ??????????????????????????????????????????
              isNearly: isNearly(curComponentStyle.left + curComponentHalfwidth, left + componentHalfwidth),
              lineNode: lines.yc as HTMLElement, // yc
              line: 'yc',
              dragShift: left + componentHalfwidth - curComponentHalfwidth,
              lineShift: left + componentHalfwidth
            },
            {
              isNearly: isNearly(curComponentStyle.left, right),
              lineNode: lines.yr as HTMLElement, // yr
              line: 'yr',
              dragShift: right,
              lineShift: right
            },
            {
              isNearly: isNearly(curComponentStyle.right, right),
              lineNode: lines.yr as HTMLElement, // yr
              line: 'yr',
              dragShift: right - curComponentStyle.width,
              lineShift: right
            }
          ]
        }

        const needToShow: LinesType[] = []
        let rotate = 0
        if (curComponent.value) {
          rotate = curComponent.value.style.width || 0
        }
        (Object.keys(conditions) as Array<ConditionKey>).forEach(key => {
          // ??????????????????????????????
          conditions[key].forEach(condition => {
            if (!condition.isNearly) return
            // ????????????????????????
            store.dispatch('canvas/setShapeSingleStyle', {
              key,
              value: rotate !== 0 ? translatecurComponentShift(key, condition, curComponentStyle) : condition.dragShift
            })

            condition.lineNode.style[key] = `${condition.lineShift}px`
            needToShow.push(condition.line)
          })
        })

        // ??????????????????????????????????????????????????????????????????????????????????????????
        // ??????????????????????????????????????????????????????????????????????????????
        if (needToShow.length) {
          chooseTheTureLine(needToShow, isDownward, isRightward)
        }
      })
    }

    const translatecurComponentShift = (key: ConditionKey, condition: ConditionItem, curComponentStyle: SfcStyleType) => {
      let width = 0
      let height = 0
      if (curComponent.value) {
        width = curComponent.value.style.width || 0
        height = curComponent.value.style.height || 0
      }
      const sfcWidth = curComponentStyle.width || 0
      const sfcHeight = curComponentStyle.height || 0
      if (key === 'top') {
        return Math.round(condition.dragShift - (height - sfcHeight) / 2)
      }

      return Math.round(condition.dragShift - (width - sfcWidth) / 2)
    }

    const chooseTheTureLine = (needToShow: LinesType[], isDownward: boolean, isRightward: boolean) => {
      // ???????????????????????? ??????????????????????????????????????? ???????????????????????????
      // ???????????????????????? ??????????????????????????????????????? ???????????????????????????
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
      // ???????????????????????????????????????
      eventBus.$on<boolean>('move', (isDownward, isRightward) => {
        showLine(isDownward, isRightward)
      })

      eventBus.$on('unmove', () => {
        hideLine()
      })
    })

    onBeforeUpdate(() => {
      (Object.keys(lines) as LinesType[]).forEach(line => {
        linesRef[line] = null
      })
    })

    return () => (
      <div class={style['mark-line']}>
        {lines.map(line => {
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
