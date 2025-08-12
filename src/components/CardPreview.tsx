import React, { useRef, useState } from 'react';
import { Card } from '../types';
import { exportCardAsImageWithDialog } from '../utils/cardUtils';

interface CardPreviewProps {
  card: Card;
  onClick?: (e?: React.MouseEvent) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onLongPress?: () => void;
  className?: string;
  isSelected?: boolean;
  showActions?: boolean;
  enableImageExport?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  onClick,
  onEdit,
  onDelete,
  onExport,
  onLongPress,
  isSelected = false,
  showActions = false,
  className = '',
  enableImageExport = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 安全的卡片数据
  const safeCard = {
    ...card,
    title: card.title || '无标题',
    summary: card.summary || '无摘要',
    keywords: card.keywords || [],
    style: {
      backgroundColor: card.style?.backgroundColor || '#ffffff',
      textColor: card.style?.textColor || '#000000',
      titleColor: card.style?.titleColor || '#000000',
      ...card.style,
    },
  };

  // 配置
  const config = {
    titleSize: 'text-lg',
    summarySize: 'text-sm',
    maxTitleLength: 40,
    maxSummaryLength: 200,
  };

  // 文本截断函数
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 格式化日期
  const formatDate = (date: string | Date): string => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '未知日期';
    }
  };

  // 卡片样式 - 修改为9:18竖图比例
  const cardStyle: React.CSSProperties = {
    backgroundColor: safeCard.style.backgroundColor,
    color: safeCard.style.textColor,
    width: '360px', // 固定宽度
    height: '720px', // 高度为宽度的2倍，实现9:18比例
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const titleStyle: React.CSSProperties = {
    color: safeCard.style.titleColor,
  };

  // 导出状态管理
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  // 移除exportSuccess状态，因为不再显示虚假成功提示

  // 处理图片导出
  const handleImageExport = async (event?: React.MouseEvent) => {
    console.log('=== handleImageExport 开始 ===');
    
    // 如果有事件对象，立即阻止所有传播
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();
    }
    
    if (!cardRef.current || isExporting) {
      return;
    }
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      await exportCardAsImageWithDialog(
        cardRef.current,
        safeCard,
        (progress, message) => {
          console.log(`导出进度: ${progress}% - ${message}`);
          setExportProgress(progress);
        }
        // 移除onSuccess回调，因为新的导出函数通过用户界面确认下载
      );
      
      // 导出函数完成后，重置状态
      // 不再显示虚假的成功提示
      setIsExporting(false);
      setExportProgress(0);
      
    } catch (error) {
      console.error('导出图片失败:', error);
      // 显示错误提示
      alert(`导出图片失败: ${error?.message || '请重试'}`);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative transition-all duration-200 cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${onClick ? 'hover:scale-105 hover:shadow-lg' : ''}
        ${className}
      `}
      onClick={onClick}
      onContextMenu={(e) => {
        if (onLongPress) {
          e.preventDefault();
          onLongPress();
        }
      }}
      style={cardStyle}
    >
      {/* 卡片内容 */}
      <div className="space-y-4 flex-1 flex flex-col">
        {/* 标题 */}
        <h3
          className={`font-bold ${config.titleSize} leading-tight`}
          style={titleStyle}
          title={safeCard.title}
        >
          {truncateText(safeCard.title, config.maxTitleLength)}
        </h3>

        {/* 摘要 */}
        <p
          className={`${config.summarySize} leading-relaxed opacity-90 flex-1 overflow-hidden`}
          title={safeCard.summary}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 8,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {safeCard.summary}
        </p>

        {/* 关键词 */}
        {safeCard.keywords && safeCard.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {safeCard.keywords.slice(0, 6).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-opacity-20 truncate max-w-20"
                style={{
                  backgroundColor: safeCard.style.titleColor,
                  color: safeCard.style.titleColor,
                }}
                title={keyword}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* 时间信息 */}
        <div className="text-xs opacity-60 mt-2 text-center">
          {formatDate(safeCard.createdAt)}
        </div>
      </div>

      {/* 导出进度条 */}
      {isExporting && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-b-lg overflow-hidden">
          <div 
            className="h-1 bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${exportProgress}%` }}
          ></div>
        </div>
      )}

      {/* 移除虚假的成功提示，因为新的导出机制通过用户交互界面确认下载 */}

      {/* 操作按钮 */}
      {showActions && (
        <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  console.log('编辑按钮被点击');
                  e.stopPropagation();
                  e.preventDefault();
                  e.nativeEvent.stopImmediatePropagation();
                  onEdit();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="p-1 rounded bg-white bg-opacity-90 hover:bg-opacity-100 transition-all"
                title="编辑"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {(onExport || enableImageExport) && (
              <button
                data-action="export"
                data-card-action="true"
                onClick={(e) => {
                  console.log('=== 导出按钮被点击 ===');
                  console.log('事件目标:', e.target);
                  console.log('当前目标:', e.currentTarget);
                  console.log('当前URL:', window.location.href);
                  console.log('事件类型:', e.type);
                  
                  // 立即阻止所有事件传播
                  e.stopPropagation();
                  e.preventDefault();
                  if (e.nativeEvent) {
                    e.nativeEvent.stopImmediatePropagation();
                    e.nativeEvent.stopPropagation();
                    e.nativeEvent.preventDefault();
                  }
                  
                  // 标记事件已处理
                  (e.target as any).__exportButtonClicked = true;
                  (e.currentTarget as any).__exportButtonClicked = true;
                  (window as any).__lastExportButtonClick = Date.now();
                  
                  // 立即执行导出功能，不使用延迟
                  console.log('立即执行导出功能');
                  if (enableImageExport) {
                    handleImageExport(e);
                  } else if (onExport) {
                    onExport();
                  }
                  console.log('导出按钮事件处理完成');
                  
                  return false;
                }}
                onMouseDown={(e) => {
                  console.log('导出按钮 mouseDown - 阻止事件传播');
                  e.stopPropagation();
                  e.preventDefault();
                  if (e.nativeEvent) {
                    e.nativeEvent.stopPropagation();
                    e.nativeEvent.preventDefault();
                  }
                }}
                onMouseUp={(e) => {
                   console.log('导出按钮 mouseUp - 阻止事件传播');
                   e.stopPropagation();
                   e.preventDefault();
                   if (e.nativeEvent) {
                     e.nativeEvent.stopPropagation();
                     e.nativeEvent.preventDefault();
                   }
                 }}
                 onPointerDown={(e) => {
                   e.stopPropagation();
                   e.preventDefault();
                 }}
                 onPointerUp={(e) => {
                   e.stopPropagation();
                   e.preventDefault();
                 }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                disabled={isExporting}
                className={`p-1 rounded bg-white bg-opacity-90 hover:bg-opacity-100 transition-all relative ${
                  isExporting ? 'cursor-not-allowed opacity-50' : ''
                }`}
                title={enableImageExport ? (isExporting ? '正在导出...' : '导出为图片') : '导出'}
                style={{ pointerEvents: isExporting ? 'none' : 'auto' }}
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  console.log('删除按钮被点击');
                  e.stopPropagation();
                  e.preventDefault();
                  e.nativeEvent.stopImmediatePropagation();
                  onDelete();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="p-1 rounded bg-white bg-opacity-90 hover:bg-opacity-100 transition-all"
                title="删除"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 选中状态指示器 */}
      {isSelected && (
        <div className="absolute top-2 left-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreview;