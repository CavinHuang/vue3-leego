/**
 * 全局state类型定义
 */
export interface RootStateType {
}

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
}

/**
 * 所有的state类型集合
 */
export interface AllStateTypes extends RootStateType {
  canvas: CanvasStateType
}
