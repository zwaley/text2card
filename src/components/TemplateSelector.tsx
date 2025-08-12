import React, { useState } from 'react';
import { Template } from '../types';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates } from '../utils/templates';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 获取过滤后的模板
  const getFilteredTemplates = () => {
    let filtered = templates;

    // 按分类过滤
    if (activeCategory !== 'all') {
      filtered = getTemplatesByCategory(activeCategory);
    }

    // 按搜索词过滤
    if (searchQuery.trim()) {
      filtered = searchTemplates(searchQuery);
    }

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="搜索模板..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setSearchQuery(''); // 清空搜索
            }}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {category.name}
            <span className="ml-1 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => onSelectTemplate(template)}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到模板</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? '尝试使用其他关键词搜索' : '该分类下暂无模板'}
          </p>
        </div>
      )}
    </div>
  );
};

// 模板卡片组件
interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 构建预览样式
  const previewStyle: React.CSSProperties = {
    backgroundColor: template.style.backgroundColor,
    color: template.style.textColor,
    fontFamily: template.style.fontFamily,
    borderRadius: `${template.style.borderRadius}px`,
    ...(template.style.gradient && {
      background: `linear-gradient(${template.style.gradient.direction}, ${template.style.gradient.from}, ${template.style.gradient.to})`,
    }),
  };

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 group
        ${
          isSelected
            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
            : 'hover:shadow-md hover:scale-105'
        }
      `}
      onClick={onSelect}
    >
      {/* 模板预览 */}
      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
        {!imageError ? (
          <div className="relative w-full h-full">
            {/* 背景图片 */}
            <img
              src={template.preview}
              alt={template.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {/* 加载状态 */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        ) : (
          /* 样式预览（当图片加载失败时） */
          <div className="w-full h-full p-4" style={previewStyle}>
            <div className="space-y-2">
              <div
                className="h-4 bg-current opacity-80 rounded"
                style={{ color: template.style.titleColor }}
              ></div>
              <div className="space-y-1">
                <div className="h-2 bg-current opacity-60 rounded"></div>
                <div className="h-2 bg-current opacity-60 rounded w-3/4"></div>
              </div>
              <div className="flex space-x-1 mt-3">
                <div className="h-2 w-8 bg-current opacity-40 rounded-full"></div>
                <div className="h-2 w-6 bg-current opacity-40 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 模板信息 */}
      <div className="mt-3 space-y-1">
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
      </div>

      {/* 选中状态指示器 */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 rounded-lg"></div>
    </div>
  );
};

export default TemplateSelector;