import { defineComponent } from 'vue'
import style from '../index.module.scss'
export default defineComponent({
  props: {
    element: {
      type: Object
    }
  },
  setup(props) {
    return () => (
      <div class={style['rect-shape']}>
        <v-text propValue={props.element?.propValue} element={props.element} />
      </div>
    )
  }
})
