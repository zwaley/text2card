import React from 'react';
import { Template } from '../types';

interface TemplatePreviewProps {
  template: Template;
  className?: string;
}

/**
 * 模板预览组件 - 使用真实的模板样式渲染预览效果
 * 替代外部API生成的图片，展示每个模板的实际视觉特征
 */
const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, className = '' }) => {
  const { style } = template;
  
  // 构建样式对象
  const cardStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    fontFamily: style.fontFamily || 'Inter, system-ui, sans-serif',
    fontSize: `${style.fontSize || 14}px`,
    padding: `${style.padding || 16}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    boxShadow: style.shadow || '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: typeof style.border === 'object' 
      ? `${style.border.width}px ${style.border.style} ${style.border.color}`
      : style.border || 'none',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%'
  };

  // 渐变背景样式
  const gradientStyle: React.CSSProperties = style.gradient ? {
    background: `linear-gradient(${style.gradient.direction || 'to bottom right'}, ${style.gradient.from}, ${style.gradient.to})`,
  } : {};

  // 标题样式
  const titleStyle: React.CSSProperties = {
    color: style.titleColor || style.textColor,
    fontSize: `${style.titleSize || (style.fontSize || 14) + 4}px`,
    fontWeight: style.fontWeight || 'bold',
    marginBottom: '8px',
    lineHeight: style.lineHeight || 1.2,
    fontFamily: style.fontFamily || 'Inter, system-ui, sans-serif'
  };

  // 文本样式
  const textStyle: React.CSSProperties = {
    color: style.textColor,
    fontSize: `${(style.fontSize || 14) - 1}px`,
    lineHeight: 1.4,
    opacity: 0.8,
    fontFamily: style.fontFamily || 'Inter, system-ui, sans-serif'
  };

  // 根据模板ID添加特殊效果
  const getSpecialEffects = () => {
    switch (template.id) {
      case 'neon':
        return (
          <>
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.5) 50%, transparent 70%)',
                animation: 'pulse 2s infinite'
              }}
            />
            <div 
              className="absolute top-2 right-2 w-4 h-4 rounded-full"
              style={{
                background: 'radial-gradient(circle, #00ffff, #ff00ff)',
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
              }}
            />
          </>
        );
      case 'watercolor':
        return (
          <>
            <div 
              className="absolute top-0 right-0 w-20 h-20 opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(255, 182, 193, 0.8), transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(30%, -30%)'
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-16 h-16 opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(173, 216, 230, 0.8), transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-30%, 30%)'
              }}
            />
          </>
        );
      case 'industrial':
        return (
          <>
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
              }}
            />
            <div 
              className="absolute bottom-0 right-0 w-1 h-full"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
              }}
            />
            <div 
              className="absolute top-2 left-2 w-2 h-2 bg-white opacity-60"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            />
          </>
        );
      case 'tech':
        return (
          <>
            <div 
              className="absolute top-0 right-0 w-8 h-8 opacity-40"
              style={{
                background: 'linear-gradient(45deg, transparent 40%, rgba(0, 150, 255, 0.6) 50%, transparent 60%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 70%, 30% 100%, 0 100%)'
              }}
            />
            <div className="absolute bottom-2 left-2 flex space-x-1">
              <div className="w-1 h-3 bg-blue-400 opacity-60" />
              <div className="w-1 h-2 bg-blue-400 opacity-40" />
              <div className="w-1 h-4 bg-blue-400 opacity-80" />
            </div>
          </>
        );
      case 'elegant':
        return (
          <>
            <div 
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                background: 'radial-gradient(ellipse at top left, rgba(218, 165, 32, 0.3), transparent 50%)'
              }}
            />
            <div 
              className="absolute bottom-2 right-2 w-6 h-1 opacity-60"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.8), transparent)'
              }}
            />
          </>
        );
      case 'vintage':
        return (
          <>
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(139, 69, 19, 0.1) 2px, rgba(139, 69, 19, 0.1) 4px)'
              }}
            />
            <div 
              className="absolute top-2 left-2 w-3 h-3 border-2 border-current opacity-40"
              style={{ borderRadius: '50%' }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{
        ...cardStyle,
        ...gradientStyle
      }}
    >
      {/* 背景装饰元素 */}
      {style.gradient && (
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            background: `radial-gradient(circle at 80% 20%, ${style.gradient.to}, transparent 50%)`
          }}
        />
      )}
      
      {/* 特殊效果 */}
      {getSpecialEffects()}
      
      {/* 内容区域 */}
      <div className="relative z-10">
        {/* 根据模板类型调整布局 */}
        {template.id === 'minimal' ? (
          <div className="text-center">
            <div style={{...titleStyle, fontSize: `${(style.fontSize || 14) + 6}px`, fontWeight: '300'}}>
              {template.name}
            </div>
            <div style={{...textStyle, marginTop: '12px', fontSize: `${style.fontSize || 14}px`}}>
              {template.description.split(' ').slice(0, 3).join(' ')}
            </div>
          </div>
        ) : template.id === 'colorful' ? (
          <div>
            <div style={{...titleStyle, background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
              {template.name}
            </div>
            <div style={textStyle}>
              {template.description.length > 60 
                ? `${template.description.substring(0, 60)}...` 
                : template.description
              }
            </div>
            <div className="flex space-x-2 mt-3">
              <div className="w-4 h-1 bg-red-400 rounded" />
              <div className="w-4 h-1 bg-blue-400 rounded" />
              <div className="w-4 h-1 bg-green-400 rounded" />
            </div>
          </div>
        ) : template.id === 'dark' ? (
          <div>
            <div style={{...titleStyle, textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'}}>
              {template.name}
            </div>
            <div style={textStyle}>
              {template.description.length > 60 
                ? `${template.description.substring(0, 60)}...` 
                : template.description
              }
            </div>
            <div className="absolute top-2 right-2 w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>
        ) : template.id === 'nature' ? (
          <div>
            <div style={titleStyle}>
              🌿 {template.name}
            </div>
            <div style={textStyle}>
              {template.description.length > 60 
                ? `${template.description.substring(0, 60)}...` 
                : template.description
              }
            </div>
            <div className="absolute bottom-2 left-2 flex space-x-1">
              <div className="w-1 h-4 bg-green-400 rounded-full opacity-60" />
              <div className="w-1 h-3 bg-green-500 rounded-full opacity-80" />
              <div className="w-1 h-5 bg-green-600 rounded-full opacity-70" />
            </div>
          </div>
        ) : (
          <div>
            <h3 style={titleStyle}>
              {template.name}
            </h3>
            <p style={textStyle}>
              {template.description.length > 60 
                ? `${template.description.substring(0, 60)}...` 
                : template.description
              }
            </p>
          </div>
        )}
      </div>
      
      {/* 底部装饰 - 根据模板类型定制 */}
      <div className="relative z-10 flex items-center justify-between mt-2">
        {template.id === 'tech' ? (
          <>
            <div className="flex space-x-1">
              <div className="w-3 h-1 bg-blue-400 rounded" />
              <div className="w-2 h-1 bg-blue-500 rounded" />
              <div className="w-4 h-1 bg-blue-600 rounded" />
            </div>
            <div className="text-xs font-mono" style={{ color: style.textColor, opacity: 0.7 }}>
              {template.category.toUpperCase()}
            </div>
          </>
        ) : template.id === 'elegant' ? (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: style.textColor, opacity: 0.8 }} />
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
            </div>
            <div className="text-xs italic" style={{ color: style.textColor, opacity: 0.6 }}>
              {template.category}
            </div>
          </>
        ) : template.id === 'vintage' ? (
          <>
            <div className="flex space-x-1">
              <div className="w-2 h-2 border border-current rounded-full opacity-60" />
              <div className="w-2 h-2 border border-current opacity-40" style={{ borderRadius: '2px' }} />
              <div className="w-2 h-2 border border-current rounded-full opacity-60" />
            </div>
            <div className="text-xs" style={{ color: style.textColor, opacity: 0.7, fontFamily: 'serif' }}>
              {template.category}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1">
              {/* 颜色指示器 */}
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: style.titleColor || style.textColor }}
              />
              <div 
                className="w-3 h-3 rounded-full opacity-60"
                style={{ backgroundColor: style.textColor }}
              />
              <div 
                className="w-3 h-3 rounded-full opacity-30"
                style={{ backgroundColor: style.backgroundColor }}
              />
            </div>
            
            {/* 分类标签 */}
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: style.textColor,
                color: style.backgroundColor,
                opacity: 0.8,
                fontSize: '10px'
              }}
            >
              {template.category}
            </span>
          </>
        )}
      </div>
      

    </div>
  );
};

export default TemplatePreview;