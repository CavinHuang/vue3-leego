import { useStore } from '@/store'
import { PointType, StyleType } from '@/types/interface'

// 角度转弧度
// Math.PI = 180 度
function angleToRadian (angle: number): number {
  return angle * Math.PI / 180
}

/**
 * 计算根据圆心旋转后的点的坐标
 * @param   {Object}  point  旋转前的点坐标
 * @param   {Object}  center 旋转中心
 * @param   {Number}  rotate 旋转的角度
 * @return  {Object}         旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
 */
export function calculateRotatedPointCoordinate (point: PointType, center: PointType, rotate: number): PointType {
  /**
   * 旋转公式：
   *  点a(x, y)
   *  旋转中心c(x, y)
   *  旋转后点n(x, y)
   *  旋转角度θ                tan ??
   * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
   * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
   */

  return {
    x: (point.x - center.x) * Math.cos(angleToRadian(rotate)) - (point.y - center.y) * Math.sin(angleToRadian(rotate)) + center.x,
    y: (point.x - center.x) * Math.sin(angleToRadian(rotate)) + (point.y - center.y) * Math.cos(angleToRadian(rotate)) + center.y
  }
}

/**
 * 获取旋转后的点坐标（八个点之一）
 * @param  {StyleType} style  样式
 * @param  {PointType} center 组件中心点
 * @param  {String} name   点名称
 * @return {Object}        旋转后的点坐标
 */
export function getRotatedPointCoordinate (style: StyleType, center: PointType, name: string): PointType {
  let point // point 是未旋转前的坐标
  switch (name) {
    case 't':
      point = {
        x: style.left + (style.width / 2),
        y: style.top
      }

      break
    case 'b':
      point = {
        x: style.left + (style.width / 2),
        y: style.top + style.height
      }

      break
    case 'l':
      point = {
        x: style.left,
        y: style.top + style.height / 2
      }

      break
    case 'r':
      point = {
        x: style.left + style.width,
        y: style.top + style.height / 2
      }

      break
    case 'lt':
      point = {
        x: style.left,
        y: style.top
      }

      break
    case 'rt':
      point = {
        x: style.left + style.width,
        y: style.top
      }

      break
    case 'lb':
      point = {
        x: style.left,
        y: style.top + style.height
      }

      break
    default: // rb
      point = {
        x: style.left + style.width,
        y: style.top + style.height
      }

      break
  }

  return calculateRotatedPointCoordinate(point, center, style.rotate)
}

// 求两点之间的中点坐标
export function getCenterPoint (p1: PointType, p2: PointType): PointType {
  return {
    x: p1.x + ((p2.x - p1.x) / 2),
    y: p1.y + ((p2.y - p1.y) / 2)
  }
}

/**
 * sin绝对值
 * @param rotate
 */
export function sin (rotate: number): number {
  return Math.abs(Math.sin(angleToRadian(rotate)))
}

/**
 * cos 绝对值
 * @param rotate
 */
export function cos (rotate: number): number {
  return Math.abs(Math.cos(angleToRadian(rotate)))
}

/**
 * 弧度
 * @param deg
 */
export function mod360 (deg: number): number {
  return (deg + 360) % 360
}

/**
 * 获取缩放后的样式
 * @param value
 */
export function changeStyleWithScale (value: number): number {
  const store = useStore()
  return value * parseInt(store.state.canvas.canvasStyleData.scale.toString()) / 100
}
