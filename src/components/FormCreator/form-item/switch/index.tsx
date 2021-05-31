import { defineComponent, computed } from 'vue'
import style from './index.module.scss'
export default defineComponent({
  name: 'switch',
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const direction = computed(() => props.text ? props.text.split('|') : [])
    const isChecked = computed<boolean>({
      get () {
        return props.modelValue
      },
      set (val) {
        emit('update:modelValue', val)
      }
    })
    function toggle() {
      isChecked.value = !isChecked.value
    }
    return () => (
      <div>
        <span class={{ [style['switch-on']]: isChecked.value, 'switch': true }} data-value={props.modelValue} onClick={() => toggle()} style="position:relative">
        {isChecked.value && direction.value.length > 0 ? (
          <div style="width:100%;height:100%;position:absolute;padding:0 5px;line-height:20px;color:#FFF;user-select:none">
            { direction.value[0] }
          </div>
        ) : ''}
        {!isChecked.value && direction.value.length > 0 ? (
          <div style="width:100%;height:100%;position:absolute;padding:0 5px;right:2px;line-height:22px;color:#7A7A7A;text-align:right;user-select:none">
            { direction.value[1] }
          </div>
        ) : ''}
      </span>
  </div>
    )
  }
})
