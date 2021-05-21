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
  setup(props) {
    console.log('111111111', props)
    return () => (
      <button class={style['v-button']}>{ props.propValue }</button>
    )
  }
})
