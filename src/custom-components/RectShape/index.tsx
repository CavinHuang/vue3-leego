import { defineComponent } from 'vue'
import style from '../index.module.scss'
export default defineComponent({
  name: 'custom-react-text',
  props: {
    element: {
      type: Object
    }
  },
  setup (props) {
    return () => (
      <div class={style['rect-shape']}>
        <v-text propValue={props.element?.propValue} element={props.element} />
      </div>
    )
  }
})
