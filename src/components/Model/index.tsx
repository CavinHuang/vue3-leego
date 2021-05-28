import { defineComponent } from 'vue'
import style from './index.module.scss'
export default defineComponent({
  name: 'Model',
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  setup (props, { slots, emit }) {
    const hide = () => {
      emit('update:modelValue', false)
    }
    const stopPropagation = (e: Event) => {
      e.stopPropagation()
    }
    return () => (
      props.modelValue ? <div class={style['modal-bg']} onClick={ () => hide() }>
        <div class="fadeInLeft animated modal" onClick={ (e: Event) => stopPropagation(e) }>
          {slots.default && slots.default()}
        </div>
      </div>
        : ''
    )
  }
})
