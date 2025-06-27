import { useResize } from '@/hooks/useResize';
import { useMemo, useRef } from 'react';
import { SCALE_CONFIG } from '@/constants';
import { BoxRect, Size, Vector2D } from '@/types';
import { clampBoundary, clampScale, getCenterCoords, getCenterScaleCoords } from '@/utils';
import { useSetState, useShallowCompareEffect, useUpdateEffect } from 'react-use';
import { useGesture } from '@use-gesture/react';

export type ViewportScaleData = ReturnType<typeof useViewportScale>;

/** 视口缩放 */
export function useViewportScale(sourceSize: Size, disabled = false) {
  const disabledRef = useRef(disabled);
  const { ref: viewportRef, size: viewportSize } = useResize();
  const [boxRect, setBoxRect] = useSetState<BoxRect>({ x: 0, y: 0, width: 0, height: 0, scale: 0 });
  const defaultScale = useMemo(() => {
    if (!viewportSize) return 1;
    const { width: vw, height: vh } = viewportSize;
    const { width, height } = sourceSize;
    return Math.round(Math.min(vw / width, vh / height) * 1e4) / 1e4;
  }, [viewportSize, sourceSize]);

  /** 缩放 */
  function scaleTo(newScale: number) {
    if (!viewportSize || !boxRect.width) return;
    const scale = clampScale(newScale, defaultScale);
    const coords = getCenterScaleCoords(viewportSize, boxRect, scale);
    const { x, y } = clampBoundary(coords, viewportSize, boxRect, scale);

    setBoxRect({ x, y, scale });
  }

  /** 移动 */
  function moveTo(coords: Vector2D) {
    if (!viewportSize) return;
    const { x, y } = clampBoundary(coords, viewportSize, boxRect);

    setBoxRect({ x, y });
  }

  // 视口尺寸变化或者资源尺寸变化时重新计算
  useShallowCompareEffect(() => {
    if (!viewportSize || !sourceSize) return;
    // const { width, height } = calculateSize(sourceSize, viewportSize);
    const { width, height } = sourceSize;
    const scale = defaultScale;
    const { x, y } = getCenterCoords(viewportSize, { width, height }, scale);

    setBoxRect({ width, height, x, y, scale });
  }, [viewportSize, sourceSize]);

  // 修复浏览器缩放时显示位置错误
  useUpdateEffect(() => scaleTo(defaultScale), [window.devicePixelRatio]);

  // 响应禁用态
  useUpdateEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  // 绑定缩放事件
  useGesture(
    {
      onPinch: ({ offset: [scale], touches }) => {
        // 触点为 0 代表电脑端，不处理，交给 onWheel 处理
        if (touches === 0 || disabledRef.current) return;
        const ratio = defaultScale / SCALE_CONFIG.defaultScale;
        scaleTo(scale * ratio);
      },
      onWheel: ({ event }) => {
        event.preventDefault(); // 防止页面缩放
        if (disabledRef.current) return;
        const { ctrlKey, metaKey, deltaX, deltaY } = event;

        // 按住 ctrlKey 或 metaKey 或双指缩放手势，触发缩放
        if (ctrlKey || metaKey) {
          const ratio = defaultScale / SCALE_CONFIG.defaultScale;
          const step = deltaY * SCALE_CONFIG.step * ratio;
          scaleTo(boxRect.scale - step);
        }
        // 否则触发移动，box大于视口才可以移动
        else if (boxRect.scale > defaultScale) {
          moveTo({
            x: boxRect.x - deltaX,
            y: boxRect.y - deltaY,
          });
        }
      },
    },
    {
      target: viewportRef,
      wheel: {
        eventOptions: { passive: false }, // 在这里配置 passive 为 false
      },
      pinch: {
        scaleBounds: {
          min: SCALE_CONFIG.min,
          max: SCALE_CONFIG.max,
        },
      },
    },
  );

  return { viewportRef, viewportSize, boxRect, defaultScale, scaleTo, moveTo };
}
