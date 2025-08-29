import { ReactNode } from 'react'

export interface LoadingWrapperProps {
  /** 是否为加载状态 */
  loading: boolean
  /** 加载文案 */
  tip?: string
  /** 子组件 */
  children?: ReactNode
  /** 自定义样式 */
  className?: string
}

/**
 * 加载状态包装组件
 */
export function LoadingWrapper({ loading, tip, children, className }: LoadingWrapperProps) {
  return (
    <div className={`relative h-full w-full ${className || ''}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-white">
          <div className="flex items-center justify-center text-sm">
            {/* 这里可以添加一个旋转的图标，比如 Ant Design 的 LoadingOutlined */}
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {tip && <span className="ml-2">{tip}</span>}
          </div>
        </div>
      )}
    </div>
  )
}
