import { defineComponent, PropType, resolveComponent, ref, h } from 'vue'
import {
  FiledInputValueType,
  FormItemComponentType,
  JsonUnknown,
  ValidateOptionType,
  InputComponentProp
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
    // eslint-disable-next-line
    const CurrentComponent = (type: string, props: InputComponentProp, children: any = '') => {
      return h(resolveComponent(type), props, children)
    }
    const sfcOnInput = ($event: FiledInputValueType, type: FormItemComponentType) => {
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
          return CurrentComponent(type, { ...attrs, modelValue: props.value, onChange: (value: FiledInputValueType) => sfcOnInput(value, props.type) })
        case 'el-radio':
        case 'el-checkbox':
          return CurrentComponent(type + '-group',
            { modelValue: props.value, onChange: (value: FiledInputValueType) => sfcOnInput(value, props.type) },
            {
              default: () => {
                return options.map((item, key) => {
                  return CurrentComponent(type, { ...{ label: item.value, disabled: item.disabled, modelValue: item.value, key: 'check-box-' + key } }, { default: () => item.label })
                })
              }
            })
        case 'el-select':
          return CurrentComponent(type,
            { ...props.attrs, modelValue: props.value, onChange: (value: string | number | Array<string | number>) => sfcOnInput(value, props.type) },
            {
              default: () => {
                return options.map((item) => {
                  return CurrentComponent('el-option', { ...item, key: 'el-option_' + item.value })
                })
              }
            })
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
