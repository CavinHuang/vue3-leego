/* eslint-disable no-lonely-if */
import { calculateRotatedPointCoordinate, getCenterPoint } from './translate'
import { SfcStyleType } from '@/types/sfc'
import { PointType } from '@/types/interface'

/**
 * 点阵信息
 */
type PointInfoType = {
  center: PointType
  symmetricPoint: PointType
  curPoint: PointType
}

/**
 * 函数类型key
 */
type FunctionStringType = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'r' | 'lb' | 'l'

/**
 * 函数类型
 */
type FunctionsType = {
  [key in FunctionStringType]: (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType) => void
}

/**
 * 所有的函数集合
 */
const funcs: FunctionsType = {
  lt: calculateLeftTop,
  t: calculateTop,
  rt: calculateRightTop,
  r: calculateRight,
  rb: calculateRightBottom,
  b: calculateBottom,
  lb: calculateLeftBottom,
  l: calculateLeft
}

/**
 * 左上角拉伸
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateLeftTop (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint } = pointInfo
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  const rotate = style.rotate || 0
  let newTopLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate)
  let newBottomRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (needLockProportion) {
    if (newWidth / newHeight > proportion) {
      newTopLeftPoint.x += Math.abs(newWidth - newHeight * proportion)
      newWidth = newHeight * proportion
    } else {
      newTopLeftPoint.y += Math.abs(newHeight - newWidth / proportion)
      newHeight = newWidth / proportion
    }

    // 由于现在求的未旋转前的坐标是以没按比例缩减宽高前的坐标来计算的
    // 所以缩减宽高后，需要按照原来的中心点旋转回去，获得缩减宽高并旋转后对应的坐标
    // 然后以这个坐标和对称点获得新的中心点，并重新计算未旋转前的坐标
    const rotatedTopLeftPoint = calculateRotatedPointCoordinate(newTopLeftPoint, newCenterPoint, rotate)
    newCenterPoint = getCenterPoint(rotatedTopLeftPoint, symmetricPoint)
    newTopLeftPoint = calculateRotatedPointCoordinate(rotatedTopLeftPoint, newCenterPoint, -rotate)
    newBottomRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)

    newWidth = newBottomRightPoint.x - newTopLeftPoint.x
    newHeight = newBottomRightPoint.y - newTopLeftPoint.y
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newTopLeftPoint.x)
    style.top = Math.round(newTopLeftPoint.y)
  }
}

/**
 * 右上角拉伸计算
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateRightTop (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint } = pointInfo
  const rotate = style.rotate || 0
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  let newTopRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate)
  let newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)

  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (needLockProportion) {
    if (newWidth / newHeight > proportion) {
      newTopRightPoint.x -= Math.abs(newWidth - newHeight * proportion)
      newWidth = newHeight * proportion
    } else {
      newTopRightPoint.y += Math.abs(newHeight - newWidth / proportion)
      newHeight = newWidth / proportion
    }

    const rotatedTopRightPoint = calculateRotatedPointCoordinate(newTopRightPoint, newCenterPoint, rotate)
    newCenterPoint = getCenterPoint(rotatedTopRightPoint, symmetricPoint)
    newTopRightPoint = calculateRotatedPointCoordinate(rotatedTopRightPoint, newCenterPoint, -rotate)
    newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)

    newWidth = newTopRightPoint.x - newBottomLeftPoint.x
    newHeight = newBottomLeftPoint.y - newTopRightPoint.y
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newBottomLeftPoint.x)
    style.top = Math.round(newTopRightPoint.y)
  }
}

/**
 * 右下角拉伸
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateRightBottom (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint } = pointInfo
  const rotate = style.rotate || 0
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  let newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)
  let newBottomRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate)

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (needLockProportion) {
    if (newWidth / newHeight > proportion) {
      newBottomRightPoint.x -= Math.abs(newWidth - newHeight * proportion)
      newWidth = newHeight * proportion
    } else {
      newBottomRightPoint.y -= Math.abs(newHeight - newWidth / proportion)
      newHeight = newWidth / proportion
    }

    const rotatedBottomRightPoint = calculateRotatedPointCoordinate(newBottomRightPoint, newCenterPoint, rotate)
    newCenterPoint = getCenterPoint(rotatedBottomRightPoint, symmetricPoint)
    newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)
    newBottomRightPoint = calculateRotatedPointCoordinate(rotatedBottomRightPoint, newCenterPoint, -rotate)

    newWidth = newBottomRightPoint.x - newTopLeftPoint.x
    newHeight = newBottomRightPoint.y - newTopLeftPoint.y
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newTopLeftPoint.x)
    style.top = Math.round(newTopLeftPoint.y)
  }
}

/**
 * 左下角拉伸计算
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateLeftBottom (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint } = pointInfo
  const rotate = style.rotate || 0
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  let newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)
  let newBottomLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -rotate)

  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (needLockProportion) {
    if (newWidth / newHeight > proportion) {
      newBottomLeftPoint.x += Math.abs(newWidth - newHeight * proportion)
      newWidth = newHeight * proportion
    } else {
      newBottomLeftPoint.y -= Math.abs(newHeight - newWidth / proportion)
      newHeight = newWidth / proportion
    }

    const rotatedBottomLeftPoint = calculateRotatedPointCoordinate(newBottomLeftPoint, newCenterPoint, rotate)
    newCenterPoint = getCenterPoint(rotatedBottomLeftPoint, symmetricPoint)
    newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -rotate)
    newBottomLeftPoint = calculateRotatedPointCoordinate(rotatedBottomLeftPoint, newCenterPoint, -rotate)

    newWidth = newTopRightPoint.x - newBottomLeftPoint.x
    newHeight = newBottomLeftPoint.y - newTopRightPoint.y
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newBottomLeftPoint.x)
    style.top = Math.round(newTopRightPoint.y)
  }
}

/**
 * 上侧拉伸计算
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateTop (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint, curPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -(style.rotate as number))
  const rotatedTopMiddlePoint = calculateRotatedPointCoordinate({
    x: curPoint.x,
    y: rotatedcurPositon.y
  }, curPoint, style.rotate as number)

  // 勾股定理
  const newHeight = Math.sqrt((rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2)

  if (newHeight > 0) {
    const newCenter = {
      x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
      y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2
    }

    let width = style.width || 0
    // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
    if (needLockProportion) {
      width = newHeight * proportion
    }

    style.width = width
    style.height = Math.round(newHeight)
    style.top = Math.round(newCenter.y - (newHeight / 2))
    style.left = Math.round(newCenter.x - (width / 2))
  }
}

/**
 * 右侧拉伸计算
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateRight (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint, curPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -(style.rotate as number))
  const rotatedRightMiddlePoint = calculateRotatedPointCoordinate({
    x: rotatedcurPositon.x,
    y: curPoint.y
  }, curPoint, style.rotate as number)

  const newWidth = Math.sqrt((rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2)
  if (newWidth > 0) {
    const newCenter = {
      x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
      y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2
    }

    let height: number = style.height || 0
    // 因为调整的是宽度 所以只需根据锁定的比例调整高度即可
    if (needLockProportion) {
      height = newWidth / proportion
    }

    style.height = height
    style.width = Math.round(newWidth)
    style.top = Math.round(newCenter.y - (height / 2))
    style.left = Math.round(newCenter.x - (newWidth / 2))
  }
}

/**
 * 计算底部拉伸
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateBottom (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint, curPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -(style.rotate as number))
  const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate({
    x: curPoint.x,
    y: rotatedcurPositon.y
  }, curPoint, style.rotate as number)

  const newHeight = Math.sqrt((rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2)
  if (newHeight > 0) {
    const newCenter = {
      x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
      y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2
    }

    let width = style.width
    // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
    if (needLockProportion) {
      width = newHeight * proportion
    }

    style.width = width
    style.height = Math.round(newHeight)
    style.top = Math.round(newCenter.y - (newHeight / 2))
    style.left = Math.round(newCenter.x - ((style.width as number) / 2))
  }
}

/**
 * 计算左侧拉伸
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
function calculateLeft (style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  const { symmetricPoint, curPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -(style.rotate as number))
  const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate({
    x: rotatedcurPositon.x,
    y: curPoint.y
  }, curPoint, style.rotate as number)

  const newWidth = Math.sqrt((rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2)
  if (newWidth > 0) {
    const newCenter = {
      x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
      y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2
    }

    let height = style.height
    if (needLockProportion) {
      height = newWidth / proportion
    }

    style.height = height
    style.width = Math.round(newWidth)
    style.top = Math.round(newCenter.y - ((style.height as number) / 2))
    style.left = Math.round(newCenter.x - (newWidth / 2))
  }
}

/**
 * 导出默认的计算函数
 * @param name
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
export default function calculateComponentPositonAndSize (name: FunctionStringType, style: SfcStyleType, curPositon: PointType, proportion: number, needLockProportion: boolean, pointInfo: PointInfoType): void {
  funcs[name](style, curPositon, proportion, needLockProportion, pointInfo)
}
