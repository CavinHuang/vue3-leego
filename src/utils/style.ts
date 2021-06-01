import { sin, cos } from '@/utils/translate'
import { ItemOptionsType, JsonUnknown, ValidateOptionType } from '@/components/FormCreator/interface'
import { ComponentAttrType, SfcStyleKey, SfcStyleType } from '@/types/sfc'
export type StyleNameMapType = {
  [key in SfcStyleKey]?: string
}
export const styleNameMap: StyleNameMapType = {
  left: 'x 坐标',
  top: 'y 坐标',
  height: '高',
  width: '宽',
  color: '颜色',
  backgroundColor: '背景色',
  borderStyle: '边框风格',
  borderWidth: '边框宽度',
  borderColor: '边框颜色',
  borderRadius: '边框半径',
  fontSize: '字体大小',
  fontWeight: '字体粗细',
  lineHeight: '行高',
  letterSpacing: '字间距',
  opacity: '透明度',
  textAlign: '左右对齐',
  verticalAlign: '上下对齐'
}

export const textAlignOptions: Array<ValidateOptionType> = [
  {
    label: '左对齐',
    value: 'left'
  },
  {
    label: '居中',
    value: 'center'
  },
  {
    label: '右对齐',
    value: 'right'
  }
]
export const borderStyleOptions: Array<ValidateOptionType> = [
  {
    label: '实线',
    value: 'solid'
  },
  {
    label: '虚线',
    value: 'dashed'
  }
]
export const verticalAlignOptions: Array<ValidateOptionType> = [
  {
    label: '上对齐',
    value: 'top'
  },
  {
    label: '居中对齐',
    value: 'middle'
  },
  {
    label: '下对齐',
    value: 'bottom'
  }
]
export const selectKey = ['textAlign', 'borderStyle', 'verticalAlign']
export type SelectionOptionsKeyType = 'textAlignOptions' | 'borderStyleOptions' | 'verticalAlignOptions'
export const selectOptionsMap = {
  textAlignOptions,
  borderStyleOptions,
  verticalAlignOptions
}

export function getStyle (style: JsonUnknown, filter:string[] = []): JsonUnknown {
  const needUnit = [
    'fontSize',
    'width',
    'height',
    'top',
    'left',
    'borderWidth',
    'letterSpacing',
    'borderRadius'
  ]

  const result: JsonUnknown = {}
  Object.keys(style).forEach((key) => {
    if (!filter.includes(key)) {
      if (key !== 'rotate') {
        result[key] = style[key]

        if (needUnit.includes(key)) {
          result[key] += 'px'
        }
      } else {
        result.transform = key + '(' + style[key] + 'deg)'
      }
    }
  })

  return result
}

// 获取一个组件旋转 rotate 后的样式
export function getComponentRotatedStyle (style: JsonUnknown): JsonUnknown {
  style = { ...style }
  if (style.rotate !== 0) {
    const newWidth = style.width * cos(style.rotate) + style.height * sin(style.rotate)
    const diffX = (style.width - newWidth) / 2 // 旋转后范围变小是正值，变大是负值
    style.left += diffX
    style.right = style.left + newWidth

    const newHeight = style.height * cos(style.rotate) + style.width * sin(style.rotate)
    const diffY = (newHeight - style.height) / 2 // 始终是正
    style.top -= diffY
    style.bottom = style.top + newHeight

    style.width = newWidth
    style.height = newHeight
  } else {
    style.bottom = style.top + style.height
    style.right = style.left + style.width
  }

  return style
}

// 计算form渲染规则
export function computedSfctStyleToForm (style: SfcStyleType, curComponent: ComponentAttrType): Array<ItemOptionsType> {
  const isPicture = curComponent.component === 'Picture'
  const actions = curComponent.actions || []
  const rules: Array<ItemOptionsType> = []
  if (actions && actions.length) {
    actions.forEach(action => {
      console.log('++======', action)
      rules.push({
        type: action.component || 'input',
        title: action.label,
        value: action.value !== undefined ? action.value : curComponent.propValue as JsonUnknown[],
        field: action.field!,
        changeType: action.changeType,
        options: action.options || [],
        props: action.props || {}
      })
    })
  }
  const colorReg = /color/ig
  const renderStyleKes = Object.keys(styleNameMap)
  for (const key in style) {
    const k = key as SfcStyleKey
    if (!renderStyleKes.includes(k)) continue
    const item = style[k]
    if (colorReg.test(k)) {
      rules.push({
        type: 'colorPicker',
        title: styleNameMap[k] as string,
        value: item as string,
        field: k
      })
    } else if (selectKey.includes(k)) {
      let options: Array<ValidateOptionType> = []
      if (k === 'textAlign') {
        options = selectOptionsMap.textAlignOptions
      } else if (k === 'borderStyle') {
        options = selectOptionsMap.borderStyleOptions
      } else {
        options = selectOptionsMap.verticalAlignOptions
      }
      rules.push({
        type: 'select',
        title: styleNameMap[k] as string,
        value: item as string,
        field: k,
        props: {
          multiple: false
        },
        options
      })
    } else if (typeof item === 'number') {
      let step = 1
      let max = Infinity
      let min = -Infinity
      if (['opacity', 'lineHeight'].includes(key)) {
        step = 0.1
        min = 0
      }
      if (key === 'opacity') {
        max = 1
      }
      rules.push({
        type: 'inputNumber',
        title: styleNameMap[k] as string,
        value: item,
        field: k,
        props: {
          step,
          min,
          max
        }
      })
    } else {
      rules.push({
        type: 'input',
        title: styleNameMap[k] as string,
        value: item as string,
        field: k,
        props: {
          type: 'text'
        }
      })
    }
  }
  if (isPicture) {
    rules.push({
      type: 'uploader',
      title: '上传图片',
      value: '',
      field: 'src',
      props: {
        showFileList: false
      }
    })
  }
  return rules
}
