/**
 * 等比例缩小图片尺寸
 * @param element  元素宽高
 * @param viewport 视口宽高
 * @return { width, height }
 */
import React from 'react'

import { clamp } from 'lodash'

import { SCALE_CONFIG } from '@/constants'
import { BoxRect, Size, Vector2D } from '@/types'

export const calculateSize = (element: Size, viewport: Size): Size => {
  const { width: elWidth, height: elHeight } = element
  const { width: viewportWidth, height: viewportHeight } = viewport

  // 选择较小的比例，确保图片宽高都适合视口
  const scaleFactor = Math.min(viewportWidth / elWidth, viewportHeight / elHeight)

  // 计算缩小后的图片尺寸
  const newWidth = Math.round(elWidth * scaleFactor)
  const newHeight = Math.round(elHeight * scaleFactor)

  return { width: newWidth, height: newHeight }
}

/** 获取居中坐标 */
export function getCenterCoords(viewportSize: Size, boxSize: Size, scale: number = 1) {
  return {
    x: (viewportSize.width - boxSize.width * scale) / 2,
    y: (viewportSize.height - boxSize.height * scale) / 2,
  }
}

export function clampScale(newScale: number, baseScale: number) {
  const scaleOffset = baseScale / SCALE_CONFIG.defaultScale
  const minScale = SCALE_CONFIG.min * scaleOffset
  const maxScale = SCALE_CONFIG.max * scaleOffset
  const scale = clamp(newScale, minScale, maxScale)
  return Math.round(scale * 1e4) / 1e4
}

/** 获取中心缩放坐标 */
export function getCenterScaleCoords(viewportSize: Size, boxRect: BoxRect, newScale: number) {
  const centerX = viewportSize.width / 2
  const centerY = viewportSize.height / 2
  const boxCenterX = boxRect.x + (boxRect.width * boxRect.scale) / 2
  const boxCenterY = boxRect.y + (boxRect.height * boxRect.scale) / 2

  const diffX = boxCenterX - centerX
  const diffY = boxCenterY - centerY
  const scaledCenterX = centerX + (diffX / boxRect.scale) * newScale
  const scaledCenterY = centerY + (diffY / boxRect.scale) * newScale

  const x = scaledCenterX - (boxRect.width * newScale) / 2
  const y = scaledCenterY - (boxRect.height * newScale) / 2

  return { x, y }
}

/** 将值控制在边界内 */
export function clampBoundary(
  coords: Vector2D,
  viewportSize: Size,
  boxRect: BoxRect,
  newScale?: number
) {
  const scale = newScale ?? boxRect.scale
  const minX = viewportSize.width - boxRect.width * scale
  const maxX = 0
  const minY = viewportSize.height - boxRect.height * scale
  const maxY = 0
  const { x: centerX, y: centerY } = getCenterCoords(viewportSize, boxRect, scale)
  const { width: viewportW, height: viewportH } = viewportSize
  const boxWidth = boxRect.width * scale
  const boxHeight = boxRect.height * scale

  // 超出容器时限制在边界内，没超出则保持居中显示
  const x = viewportW >= boxWidth ? centerX : clamp(coords.x, minX, maxX)
  const y = viewportH >= boxHeight ? centerY : clamp(coords.y, minY, maxY)

  return { x, y }
}

/** 拖拽封装 */
export function drag(
  event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent,
  startCoords: Vector2D,
  onMove: (newCoords: Vector2D, oldCoords: Vector2D, diffCoords: Vector2D) => void
) {
  event.preventDefault()
  const sx = 'touches' in event ? event.touches[0].clientX : event.clientX
  const sy = 'touches' in event ? event.touches[0].clientY : event.clientY
  const oldRect = { ...startCoords }

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    const ex = 'touches' in e ? e.touches[0].clientX : e.clientX
    const ey = 'touches' in e ? e.touches[0].clientY : e.clientY
    const dx = ex - sx
    const dy = ey - sy
    onMove(
      { x: oldRect.x + dx, y: oldRect.y + dy },
      { x: oldRect.x, y: oldRect.y },
      { x: dx, y: dy }
    )
  }
  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('touchmove', handleMouseMove)
    window.removeEventListener('touchend', handleMouseUp)
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('touchmove', handleMouseMove)
  window.addEventListener('touchend', handleMouseUp)
}
