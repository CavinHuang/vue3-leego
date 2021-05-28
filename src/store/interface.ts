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
  editMode: 'edit' | 'preview',
  updateFrom: 'form' | 'action'
  prevCurComponentsStyle: JsonUnknown,
  areaData: {
    style: JsonUnknown,
    components: JsonUnknown[]
  }
}

/**
 * 组件片段操作
 */
export interface SnapshotStateType {
  snapshotData: Array<any>
  snapshotIndex: number
}

/**
 * 右键操作
 */
export interface ContextMenuStateType  {
  menuTop: number
  menuLeft: number
  menuShow: boolean
}

/**
 * 画布操作
 */
export interface CanvasActionStateType {
  copyData: null | JsonUnknown
  isCut: boolean
}

/**
 * 组件动画
 */
export interface AnimationStateType {
  [key: string]: any
}

/**
 * 全局state类型定义
 */
export interface RootStateType {
  canvas: CanvasStateType
  canvasAction: CanvasActionStateType
  snapshot: SnapshotStateType,
  contextMenu: ContextMenuStateType,
  animation: AnimationStateType
}
