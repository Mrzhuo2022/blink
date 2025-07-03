import React from 'react';

interface BlinkLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

const BlinkLogo: React.FC<BlinkLogoProps> = ({
  size = 'md',
  className = '',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  // 根据variant和className智能选择颜色
  const getTextColors = () => {
    // 如果className包含text-white，说明是在深色背景上
    if (className.includes('text-white') || variant === 'dark') {
      return {
        title: 'text-white',
        slogan: 'text-white/80',
      };
    }
    // 如果是light variant，使用深色文字
    if (variant === 'light') {
      return {
        title: 'text-gray-900',
        slogan: 'text-gray-700',
      };
    }
    // 默认情况，适应系统主题
    return {
      title: 'text-gray-800 dark:text-white',
      slogan: 'text-gray-600 dark:text-gray-300',
    };
  };

  const textColors = getTextColors();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 眨眼图标 */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        <div className="animate-blink-glow absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"></div>
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {/* 眼睛轮廓 */}
          <div className="relative h-full w-full">
            {/* 眼睛底部 */}
            <div className="absolute inset-0 rounded-full bg-white"></div>
            {/* 眼睑动画 */}
            <div className="animate-blink-eyelid absolute inset-0 origin-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            {/* 眼珠 */}
            <div className="animate-blink-pupil absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-800"></div>
          </div>
        </div>
      </div>

      {/* 品牌文字 */}
      <div className="flex flex-col">
        <span
          className={`font-bold ${textColors.title} ${
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'
          }`}
        >
          Blink
        </span>
        {size !== 'sm' && (
          <span
            className={`${textColors.slogan} ${
              size === 'md' ? 'text-xs' : 'text-sm'
            } leading-tight drop-shadow-sm`}
          >
            Pause for clarity
          </span>
        )}
      </div>
    </div>
  );
};

export default BlinkLogo;
