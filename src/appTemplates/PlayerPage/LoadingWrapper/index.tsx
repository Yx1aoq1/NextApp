import { ReactNode } from 'react';

export interface LoadingWrapperProps {
  /** 是否为加载状态 */
  loading: boolean;
  /** 加载文案 */
  tip?: string;
  /** 子组件 */
  children?: ReactNode;
  /** 自定义样式 */
  className?: string;
}

/**
 * 加载状态包装组件
 */
export function LoadingWrapper({ loading, tip, children, className }: LoadingWrapperProps) {
  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 text-sm flex justify-center items-center bg-black/50 text-white">
          <div className="flex justify-center items-center text-sm">
            {/* 这里可以添加一个旋转的图标，比如 Ant Design 的 LoadingOutlined */}
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {tip && <span className="ml-2">{tip}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
