import { defineComponent, PropType, resolveComponent, ref, h } from 'vue'
import {
  FiledInputValueType,
  FormItemComponentType,
  JsonUnknown,
  ValidateOptionType,
  InputComponentProp
} from '../interface'
import { ActionChangeType } from '@/types/sfc'
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
    },
    changeType: {
      type: String as PropType<ActionChangeType>,
      default: 'style'
    }
  },
  emits: ['data-change'],
  setup (props, { emit }) {
    const sfcType = ref(props.component)
    // eslint-disable-next-line
    const CurrentComponent = (type: string, props: InputComponentProp, children: any = '') => {
      return h(resolveComponent(type), props, children)
    }
    const sfcOnInput = ($event: FiledInputValueType, field: string, type?: FormItemComponentType, changeType?: ActionChangeType) => {
      emit('data-change', $event, field, type, changeType || props.changeType)
    }
    const RenderItemSfc = (props: JsonUnknown) => {
      const type: FormItemComponentType = props.type
      const attrs: JsonUnknown = props.attrs
      const options: Array<ValidateOptionType> = props.options
      switch (type) {
        case 'el-input':
        case 'el-input-number':
          return CurrentComponent(type, { ...props.attrs, modelValue: props.value, onInput: (event: string | number) => sfcOnInput(event, props.field) })
        case 'el-color-picker':
          return CurrentComponent(type, { ...attrs, modelValue: props.value, onChange: (value: FiledInputValueType) => sfcOnInput(value, props.field) })
        case 'el-radio':
        case 'el-checkbox':
          return CurrentComponent(type + '-group',
            { modelValue: props.value, onChange: (value: FiledInputValueType) => sfcOnInput(value, props.field) },
            {
              default: () => {
                return options.map((item, key) => {
                  return CurrentComponent(type, { ...{ label: item.value, disabled: item.disabled, modelValue: item.value, key: 'check-box-' + key } }, { default: () => item.label })
                })
              }
            })
        case 'el-select':
          return CurrentComponent(type,
            { ...props.attrs, modelValue: props.value, onChange: (value: string | number | Array<string | number>) => sfcOnInput(value, props.field) },
            {
              default: () => {
                return options.map((item) => {
                  return CurrentComponent('el-option', { ...item, key: 'el-option_' + item.value })
                })
              }
            })
        case 'form-uploader':
          return CurrentComponent(type, { ...attrs, onChange: (value: FiledInputValueType) => sfcOnInput(value, props.field, type) })
        case 'swipe-edit':
          return CurrentComponent(type, { ...attrs, modelValue: props.value, onChange: (value: FiledInputValueType) => sfcOnInput(value, props.field, type) })
        case 'customer-switch':
          return CurrentComponent(type, { ...attrs, modelValue: props.value, onChange: (value: FiledInputValueType) => sfcOnInput(value, props.field, type, props.changeType) })
        default:
          return h(type, { name: type, ...attrs, modelValue: props.value })
      }
    }

    return () => (
      <RenderItemSfc { ...{ type: sfcType.value, field: props.field, attrs: props.attrs, options: props.options, changeType: props.changeType, value: props.value } } />
    )
  }
})
