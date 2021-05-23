import { JsonUnknown } from '@/components/FormCreator/interface'

/**
 * 画布样式数据
 */
export interface CanvasStyleType {
  width: number
  height: number
  scale: number
}

/**
 * 画布类型
 */
export interface CanvasStateType {
  canvasStyleData: CanvasStyleType
  componentData: Array<JsonUnknown>
  isClickComponent: boolean
  curComponent: null | JsonUnknown | any
  curComponentIndex: number
  editor: null | HTMLElement
  editMode: 'edit' | 'preview'
}

export interface SnapshotStateType {
  snapshotData: Array<any>
  snapshotIndex: number
}

/**
 * 全局state类型定义
 */
export interface RootStateType {
  canvas: CanvasStateType
  snapshot: SnapshotStateType
}
