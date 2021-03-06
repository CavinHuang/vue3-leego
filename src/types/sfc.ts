import {FiledInputValueType, FormItemType, JsonUnknown, ValidateOptionType} from '@/components/FormCreator/interface'

/**
 * 公共共有的样式
 */
export interface CommonStyleType {
  rotate: number
  opacity: number
}

/**
 * 单个动画样式
 */
export interface AnimationItemType {
  value: string
  label: string
}

/**
 * 组件样式
 */
export interface SfcStyleType {
  width?: number
  height?: number
  fontSize?: number
  fontWeight?: number | 'normal' | 'bold'
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'right' | 'center' | ''
  color?: string
  borderStyle?: 'solid' | 'dashed' | ''
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  backgroundColor?: string
  verticalAlign?: 'middle' | 'top' | 'bottom'
  rotate?: number
  top?: number
  left?: number
  right?: number
  bottom?: number
  opacity?: number
}

export type SfcStyleKey = keyof SfcStyleType

/**
 * 公共共有属性
 */
export interface CommonAttrType {
  id?: number
  animations: AnimationItemType[]
  events: JsonUnknown
  groupStyle: SfcStyleType
  isLock: boolean
}

/**
 * 所有的组件类型
 */
export type AllCustomComponentType = 'VText' | 'VButton' | 'Picture' | 'RectShape' | 'Group' | 'v-text' | 'v-button' | 'rect-shape' | 'Swiper' | 'CustomerIcon' | 'iconSelect'

export type ActionChangeType = 'value' | 'attr' | 'style'

export type ActionsItem = {
  label: string
  field?: string
  value?: FiledInputValueType
  options?: Array<ValidateOptionType>
  props?: JsonUnknown
  changeType?: ActionChangeType
  component?: FormItemType
}

/**
 * 组件属性
 */
export interface ComponentType {
  component: AllCustomComponentType
  label: string
  propValue: unknown
  icon: string
  style: SfcStyleType,
  actions?: ActionsItem[]
  props?: JsonUnknown
}

/**
 * 组件所有的属性
 */
export interface ComponentAttrType extends ComponentType, CommonAttrType{

}
