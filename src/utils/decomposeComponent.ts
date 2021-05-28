import { $ } from './index'
import { mod360 } from './translate'
import { JsonUnknown } from '@/components/FormCreator/interface'
import { ComponentAttrType } from '@/types/sfc'

// 将组合中的各个子组件拆分出来，并计算它们新的 style
export default function decomposeComponent (component: ComponentAttrType, editorRect: JsonUnknown, parentStyle: JsonUnknown): void {
  const selector = `#component${component.id}`
  const element = $(selector)
  if (element) {
    const componentRect = element.getBoundingClientRect()
    // 获取元素的中心点坐标
    const center = {
      x: componentRect.left - editorRect.left + componentRect.width / 2,
      y: componentRect.top - editorRect.top + componentRect.height / 2
    }
    const groupWidth = component.groupStyle.width ? component.groupStyle.width : 0
    const groupHeight = component.groupStyle.height ? component.groupStyle.height : 0
    component.style.rotate = mod360(component.style.rotate + parentStyle.rotate)
    component.style.width = parseFloat(groupWidth.toString()) / 100 * parentStyle.width
    component.style.height = parseFloat(groupHeight.toString()) / 100 * parentStyle.height
    // 计算出元素新的 top left 坐标
    component.style.left = center.x - component.style.width / 2
    component.style.top = center.y - component.style.height / 2
    component.groupStyle = {}
  }
}
