import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  className?: string;
  color?: 'blue' | 'gray' | 'white';
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  type = 'spinner',
  text,
  className = '',
  color = 'blue',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'text-blue-600 border-blue-600',
    gray: 'text-gray-600 border-gray-600',
    white: 'text-white border-white',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const renderSpinner = () => (
    <div
      className={`
        animate-spin rounded-full border-2 border-t-transparent
        ${sizeClasses[size]} ${colorClasses[color]}
      `}
    >
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            rounded-full bg-current animate-pulse
            ${size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-3 h-3' : 'w-4 h-4'}
            ${colorClasses[color]}
          `}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        >
        </div>
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={`
        rounded-full bg-current animate-pulse
        ${sizeClasses[size]} ${colorClasses[color]}
      `}
    >
    </div>
  );

  const renderBars = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`
            bg-current animate-pulse
            ${size === 'small' ? 'w-1' : size === 'medium' ? 'w-1.5' : 'w-2'}
            ${colorClasses[color]}
          `}
          style={{
            height: size === 'small' ? '12px' : size === 'medium' ? '20px' : '28px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s',
          }}
        >
        </div>
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderLoader()}
      {text && (
        <div className={`${textSizeClasses[size]} ${colorClasses[color]} font-medium`}>
          {text}
        </div>
      )}
    </div>
  );
};

// 页面级加载组件
export const PageLoading: React.FC<{ text?: string }> = ({ text = '加载中...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <Loading size="large" text={text} />
    </div>
  </div>
);

// 卡片加载骨架屏
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        {/* 标题骨架 */}
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        
        {/* 内容骨架 */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* 标签骨架 */}
        <div className="flex space-x-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* 时间骨架 */}
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

// 列表加载骨架屏
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="flex items-center space-x-4">
          {/* 图标骨架 */}
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          
          {/* 内容骨架 */}
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          
          {/* 操作按钮骨架 */}
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// 内联加载组件
export const InlineLoading: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-center space-x-2">
    <Loading size="small" type="spinner" />
    {text && <span className="text-sm text-gray-600">{text}</span>}
  </div>
);

// 按钮加载状态
export const ButtonLoading: React.FC<{ size?: 'small' | 'medium' }> = ({ size = 'small' }) => (
  <Loading size={size} type="spinner" color="white" />
);

// 全屏加载遮罩
export const FullScreenLoading: React.FC<{ text?: string; show: boolean }> = ({ 
  text = '处理中...', 
  show 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <Loading size="large" text={text} />
      </div>
    </div>
  );
};

export default Loading;