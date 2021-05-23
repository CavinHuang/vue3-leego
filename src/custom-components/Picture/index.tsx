import { defineComponent } from 'vue'
import style from '../index.module.scss'
export default defineComponent({
  props: {
    propValue: {
      type: String,
      require: true
    }
  },
  setup (props) {
    return () => (
      <div style="overflow: hidden" class={style.picture}>
        <img src={props.propValue} />
      </div>
    )
  }
})
