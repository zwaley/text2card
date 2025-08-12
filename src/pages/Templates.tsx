import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTemplates, getTemplatesByCategory, TEMPLATE_CATEGORIES } from '../utils/templates';
import { Template } from '../types';
import TemplatePreview from '../components/TemplatePreview';

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // 加载模板数据
  useEffect(() => {
    const allTemplates = getAllTemplates();
    setTemplates(allTemplates);
    setFilteredTemplates(allTemplates);
  }, []);

  // 处理筛选和搜索
  useEffect(() => {
    let result = templates;
    
    // 分类筛选
    if (selectedCategory !== 'all') {
      result = getTemplatesByCategory(selectedCategory);
    }
    
    // 搜索过滤
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      result = result.filter(
        template =>
          template.name.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm) ||
          template.category.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredTemplates(result);
  }, [templates, selectedCategory, searchQuery]);

  // 使用模板创建卡片
  const handleUseTemplate = (template: Template) => {
    navigate('/create', {
      state: {
        selectedTemplate: template.id
      }
    });
  };

  // 预览模板
  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  // 渲染模板卡片
  const renderTemplateCard = (template: Template) => (
    <div
      key={template.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      {/* 模板预览 - 使用真实样式渲染 */}
      <div className="aspect-video bg-gray-100 overflow-hidden relative p-4">
        <TemplatePreview 
          template={template}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* 悬浮操作按钮 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <button
              onClick={() => handlePreviewTemplate(template)}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              预览
            </button>
            <button
              onClick={() => handleUseTemplate(template)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              使用
            </button>
          </div>
        </div>
      </div>
      
      {/* 模板信息 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {template.name}
          </h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {template.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {template.description}
        </p>
        
        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={() => handlePreviewTemplate(template)}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            预览
          </button>
          <button
            onClick={() => handleUseTemplate(template)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
          >
            使用模板
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染模板预览对话框
  const renderPreviewModal = () => {
    if (!selectedTemplate || !showPreview) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* 对话框头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
              <p className="text-gray-600 mt-1">{selectedTemplate.description}</p>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 预览内容 */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 预览图 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">模板预览</h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden p-6">
                  <TemplatePreview 
                    template={selectedTemplate}
                    className="w-full h-full"
                  />
                </div>
              </div>
              
              {/* 模板详情 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">模板详情</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {selectedTemplate.category}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <p className="text-gray-600 text-sm">{selectedTemplate.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">样式特点</label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: selectedTemplate.style.backgroundColor }}
                        ></div>
                        <span className="text-gray-600">背景色</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: selectedTemplate.style.textColor }}
                        ></div>
                        <span className="text-gray-600">文字色</span>
                      </div>
                      <div className="text-gray-600">
                        字体: {selectedTemplate.style.fontSize}
                      </div>
                      <div className="text-gray-600">
                        圆角: {selectedTemplate.style.borderRadius}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 对话框底部 */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              关闭
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                handleUseTemplate(selectedTemplate);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              使用此模板
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">模板库</h1>
          <p className="text-gray-600">选择合适的模板，快速创建精美卡片</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索模板..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {TEMPLATE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 模板统计 */}
        <div className="mb-6">
          <p className="text-gray-600">
            共 {filteredTemplates.length} 个模板
            {searchQuery && ` · 搜索 "${searchQuery}"`}
            {selectedCategory !== 'all' && ` · 分类 "${selectedCategory}"`}
          </p>
        </div>

        {/* 模板网格 */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' ? '没有找到匹配的模板' : '暂无模板'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' ? '尝试调整搜索条件或选择其他分类' : '模板正在开发中，敬请期待'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                查看全部模板
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(renderTemplateCard)}
          </div>
        )}

        {/* 底部提示 */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            没有找到合适的模板？
          </p>
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            自定义创建卡片
          </button>
        </div>
      </div>

      {/* 预览对话框 */}
      {renderPreviewModal()}
    </div>
  );
};

export default Templates;