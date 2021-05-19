import { VNode, VNodeArrayChildren } from 'vue'
export * from './element'
/**
 * children
 */
export type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any) | {[key: string]: any}

/**
 * 无法描述的JSON数据
 */
export interface JsonUnknown {
  [field: string]: any
}

/**
 * 表单输入组件类型
 */
export type FormItemType = 'input' | 'inputNumber' | 'radio' | 'checkbox' | 'select' | 'colorPicker' | 'uploader'

/**
 * 输入组件
 */
export type FormItemComponentType = 'el-input' | 'el-input-number' | 'el-radio' | 'el-checkbox' | 'el-select' | 'el-color-picker' | 'form-uploader'

/**
 * col配置
 */
export interface ColType {
  span: number
  labelWidth?: number
}

export type FiledInputValueType = string | number | boolean | Array<string | number>

/**
 * 表单单项配置
 */
export interface FieldsConfigType {
  type: FormItemType
  value: FiledInputValueType
  component: FormItemComponentType
  attrs: JsonUnknown
  options?: Array<ValidateOptionType>
  col?: ColType
  field: string
  label?: string
}

interface ValidateCallbackType {
  (message?: string | Error | undefined): Error | void
}

interface ValidatorType {
  (rule: object, value: string, callback: ValidateCallbackType): void
}

/**
 * 表单验证项
 */
export interface ValidateItemType {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change'
  validator?: ValidatorType
}

/**
 * 选项类型
 */
export interface ValidateOptionType {
  value: string | number | boolean
  label: string
  disabled?: boolean
}

/**
 * 单项输入配置
 */
export interface ItemOptionsType {
  type: FormItemType
  title: string
  field: string
  value: FiledInputValueType
  options?: Array<ValidateOptionType>
  col?: ColType
  props?: JsonUnknown
  validate?: Array<ValidateItemType>
}

/**
 * 渲染组件的props
 */
export interface InputComponentProp {
  modelValue?: FiledInputValueType,
  onChange?: (value: FiledInputValueType) => void,
  key?: string | number
}
