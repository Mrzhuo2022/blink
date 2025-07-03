import React from 'react';
import { getGradientClass } from '@/lib/themes';

interface ThemePreviewProps {
  themeId: string;
  breakType: 'short' | 'long';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// 主题预览组件
export const ThemePreview: React.FC<ThemePreviewProps> = ({
  themeId,
  breakType,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const gradientClass = getGradientClass(themeId, breakType);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${gradientClass} ${className}`}
      title={`${breakType === 'short' ? '小憩' : '休息'}主题预览`}
    />
  );
};

// 全屏主题预览组件（用于设置页面的大预览）
export const FullscreenThemePreview: React.FC<{ themeId: string }> = ({ themeId }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-center">
        <div className={`h-16 w-full rounded-lg ${getGradientClass(themeId, 'short')} mb-2`} />
        <span className="text-xs text-gray-600 dark:text-gray-400">小憩主题</span>
      </div>
      <div className="text-center">
        <div className={`h-16 w-full rounded-lg ${getGradientClass(themeId, 'long')} mb-2`} />
        <span className="text-xs text-gray-600 dark:text-gray-400">休息主题</span>
      </div>
    </div>
  );
};

export default ThemePreview;
