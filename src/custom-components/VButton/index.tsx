import { defineComponent } from 'vue'
import style from '../index.module.scss'
export default defineComponent({
  name: 'CustomButton',
  props: {
    propValue: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    return () => (
      <button class={style['v-button']}>{ props.propValue }</button>
    )
  }
})
