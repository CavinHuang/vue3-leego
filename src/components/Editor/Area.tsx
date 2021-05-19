import { defineComponent, PropType } from 'vue'
import { PointType } from './interface'
import style from './index.module.scss'

export default defineComponent({
  props: {
    start: {
      type: Object as PropType<PointType>,
      default: () => ({
        x: 0,
        y: 0
      })
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  setup (props) {
    return () => (
      <div style={{
        left: props.start.x + 'px',
        top: props.start.y + 'px',
        width: props.width + 'px',
        height: props.height + 'px'
      }} class={style.area} />
    )
  }
})
