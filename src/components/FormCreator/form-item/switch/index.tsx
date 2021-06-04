import { defineComponent, computed, ref } from 'vue'
import style from './index.module.scss'
export default defineComponent({
  name: 'customer-switch',
  props: {
    modelValue: {
      type: [Boolean],
      default: true
    },
    text: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const direction = computed(() => props.text ? props.text.split('|') : [])
    const _value = ref(true)
    const isChecked = computed<boolean>({
      get () {
        return _value.value !== props.modelValue ? _value.value : props.modelValue
      },
      set (val) {
        _value.value = val
        emit('change', val)
      }
    })
    function toggle () {
      console.log(isChecked.value)
      isChecked.value = !isChecked.value
      console.log(isChecked.value)
    }
    return () => (
      <div>
        <span class={{ [style['switch-on']]: isChecked.value, [style.switch]: true }} data-value={props.modelValue} onClick={() => toggle()} style="position:relative">
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
