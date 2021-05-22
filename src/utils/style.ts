import { sin, cos } from '@/utils/translate'
import { ItemOptionsType, JsonUnknown, ValidateOptionType } from '@/components/FormCreator/interface'

const styleNameMap: any = {
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

const textAlignOptions: Array<ValidateOptionType> = [
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
const borderStyleOptions: Array<ValidateOptionType> = [
  {
    label: '实线',
    value: 'solid'
  },
  {
    label: '虚线',
    value: 'dashed'
  }
]
const verticalAlignOptions: Array<ValidateOptionType> = [
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
const selectKey = ['textAlign', 'borderStyle', 'verticalAlign']
const selectOptionsMap = {
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
export function computedSfctStyleToForm (style: JsonUnknown): Array<ItemOptionsType> {
  const rules: Array<ItemOptionsType> = []

  const colorReg = /color/ig
  const renderStyleKes = Object.keys(styleNameMap)
  for (const k in style) {
    if (!renderStyleKes.includes(k)) continue
    const item = style[k]
    if (colorReg.test(k)) {
      rules.push({
        type: 'colorPicker',
        title: styleNameMap[k],
        value: item,
        field: k
      })
    } else if (selectKey.includes(k)) {
      rules.push({
        type: 'select',
        title: styleNameMap[k],
        value: item,
        field: k,
        props: {
          multiple: false
        },
        options: selectOptionsMap[k + 'Options'] as Array<ValidateOptionType>
      })
    } else if (typeof item === 'number') {
      rules.push({
        type: 'inputNumber',
        title: styleNameMap[k],
        value: item,
        field: k
      })
    } else {
      rules.push({
        type: 'input',
        title: styleNameMap[k],
        value: item,
        field: k,
        props: {
          type: 'text'
        }
      })
    }
  }
  return rules
}
