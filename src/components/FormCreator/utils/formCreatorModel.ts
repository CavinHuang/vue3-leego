/**
 * 表单组件生成数据模型控制
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/17
*/
import { reactive } from 'vue'
import { FieldsConfigType, FormItemComponentType, FormItemType, ItemOptionsType, JsonUnknown } from '../interface'

/**
 * 计算需要调用的组件
 * @param type
 */
const useComputedSfc = (type: FormItemType): FormItemComponentType => {
  switch (type) {
    case 'input':
      return 'el-input'
    case 'checkbox':
      return 'el-checkbox'
    case 'colorPicker':
      return 'el-color-picker'
    case 'inputNumber':
      return 'el-input-number'
    case 'radio':
      return 'el-radio'
    case 'select':
      return 'el-select'
    case 'uploader':
      return 'form-uploader'
    default:
      return 'el-input'
  }
}

/**
 * 组件属性计算
 * @param type
 * @param props
 */
const useComputedAttrs = (type: FormItemType, props: JsonUnknown = {}): JsonUnknown => {
  const sfcProps: JsonUnknown = {}
  switch (type) {
    case 'input':
      sfcProps.type = type
  }
  return Object.assign({}, sfcProps, props)
}

/**
 * 需要计算
 * 1、form需要的model
 * 2、form需要的rules
 * 3、根据type计算每一项的组件的属性
 * @param renderRules
 */
export default function formCreatorModel (renderRules: Array<ItemOptionsType>) {
  const model = reactive<JsonUnknown>({})
  const rules = reactive<JsonUnknown>({})
  const fieldsConfig = reactive<Array<FieldsConfigType>>([])

  for (let i = 0; i < renderRules.length; i++) {
    const item = renderRules[i]
    const { type, field, title: label, value: defaultValue, col, props, validate, options } = item
    model[field] = defaultValue
    rules[field] = validate
    fieldsConfig.push({
      type,
      value: model[field],
      field,
      col,
      component: useComputedSfc(type),
      label,
      options: options,
      attrs: useComputedAttrs(type, props)
    })
  }

  return {
    model,
    rules,
    fieldsConfig
  }
}
