import { defineComponent, PropType, resolveComponent, ref, h } from 'vue'
import {
  FiledInputValueType,
  FormItemComponentType,
  JsonUnknown,
  ValidateOptionType
} from '../interface'
export default defineComponent({
  name: 'form-creator-item',
  props: {
    component: {
      type: String as PropType<FormItemComponentType>,
      default: 'el-input'
    },
    attrs: {
      type: Object as PropType<JsonUnknown>,
      default: () => ({})
    },
    options: {
      type: Array as PropType<Array<ValidateOptionType>>,
      default: () => ([])
    },
    field: {
      type: String,
      default: 'default'
    },
    value: {
      type: [String, Number, Boolean, Array] as PropType<FiledInputValueType>,
      default: ''
    }
  },
  emits: ['data-change'],
  setup (props, { emit }) {
    const sfcType = ref(props.component)
    const CurrentComponent = (type: string, props: any, children: any = '') => {
      return h(resolveComponent(type), props, children)
    }
    const sfcOnInput = ($event: any, type: FormItemComponentType) => {
      emit('data-change', $event, type)
    }
    const RenderItemSfc = (props: JsonUnknown) => {
      console.log('在用的props:', props)
      const type: FormItemComponentType = props.type
      const attrs: JsonUnknown = props.attrs
      const options: Array<ValidateOptionType> = props.options
      switch (type) {
        case 'el-input':
        case 'el-input-number':
          return CurrentComponent(type, { ...props.attrs, modelValue: props.value, onInput: (event: string | number) => sfcOnInput(event, props.type) })
        case 'el-color-picker':
          return CurrentComponent(type, { ...attrs, modelValue: props.value, onChange: (value: string | number) => sfcOnInput(value, props.type) })
        case 'el-radio':
        case 'el-checkbox':
          const children = options.map((item, key) => {
            return CurrentComponent(type, { ...{ label: item.value, disabled: item.disabled, modelValue: item.value, key: 'check-box-' + key } }, { default: () => item.label })
          })
          return CurrentComponent(type + '-group', { modelValue: props.value, onChange: (value: string | number) => sfcOnInput(value, props.type) }, { default: () => children })
        case 'el-select':
          const optionChildren = options.map((item) => {
            return CurrentComponent('el-option', { ...item, key: 'el-option_' + item.value })
          })
          return CurrentComponent(type, { ...props.attrs, modelValue: props.value, onChange: (value: string | number | Array<string | number>) => sfcOnInput(value, props.type) }, { default: () => optionChildren })
        case 'form-uploader':
          return h(type, { name: type, ...attrs })
        default:
          return h(type, { name: type, ...attrs })
      }
    }

    return () => (
      <RenderItemSfc { ...{ type: sfcType.value, attrs: props.attrs, options: props.options, value: props.value } } />
    )
  }
})
