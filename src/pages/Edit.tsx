import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditStore, useAppStore } from '../store';
import CardPreview from '../components/CardPreview';
import { InlineLoading, PageLoading } from '../components/Loading';
import { getAllTemplates } from '../utils/templates';
import { applyTemplate, updateCard } from '../utils/cardUtils';
import { Card, CardStyle } from '../types';

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, updateCard: updateCardInStore, removeCard } = useAppStore();
  const {
    card: currentCard,
    isModified,
    setCard: setCurrentCard,
    updateCardField,
    updateCardStyle
  } = useEditStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'template'>('content');
  const [templates] = useState(getAllTemplates());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 加载卡片数据
  useEffect(() => {
    console.log('=== Edit页面 useEffect 执行 ===');
    console.log('URL参数ID:', id);
    console.log('当前cards数量:', cards.length);
    console.log('所有cards的ID:', cards.map(c => c.id));
    
    if (id) {
      const card = cards.find(c => c.id === id);
      console.log('查找到的卡片:', card);
      
      if (card) {
        console.log('卡片存在，设置当前卡片');
        setCurrentCard(card);
      } else {
        console.log('卡片不存在，即将跳转到portfolio');
        console.log('当前URL:', window.location.href);
        alert('卡片不存在');
        navigate('/portfolio');
      }
    }
    setIsLoading(false);
  }, [id, cards, setCurrentCard, navigate]);

  // 清理状态
  useEffect(() => {
    return () => {
      // 组件卸载时的清理逻辑
    };
  }, []);

  // 处理内容更新
  const handleContentUpdate = (field: keyof Card, value: string | string[]) => {
    if (!currentCard) return;
    
    updateCardField(field, value);
  };

  // 处理样式更新
  const handleStyleUpdate = (field: keyof CardStyle, value: string | number) => {
    if (!currentCard) return;
    
    updateCardStyle({ [field]: value });
  };

  // 应用模板
  const handleApplyTemplate = (templateId: string) => {
    if (!currentCard) return;
    
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    const updatedCard = applyTemplate(currentCard, template);
    setCurrentCard(updatedCard);
  };

  // 保存卡片
  const handleSave = async () => {
    if (!currentCard || !isModified) return;
    
    setIsSaving(true);
    try {
      const updatedCard = updateCard(currentCard, {
        updatedAt: new Date()
      });
      const success = await updateCardInStore(currentCard.id, updatedCard);
      if (success) {
        setCurrentCard(updatedCard);
        alert('保存成功！');
      } else {
        alert('保存失败，请重试');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 删除卡片
  const handleDelete = async () => {
    if (!currentCard) return;
    
    setIsDeleting(true);
    try {
      await removeCard(currentCard.id);
      alert('删除成功！');
      navigate('/portfolio');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // 渲染内容编辑
  const renderContentEditor = () => {
    if (!currentCard) return null;
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标题
          </label>
          <input
            type="text"
            value={currentCard.title}
            onChange={(e) => handleContentUpdate('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入卡片标题"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            内容
          </label>
          <textarea
            value={currentCard.content}
            onChange={(e) => handleContentUpdate('content', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入卡片内容"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            摘要
          </label>
          <textarea
            value={currentCard.summary}
            onChange={(e) => handleContentUpdate('summary', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入卡片摘要"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            关键词
          </label>
          <input
            type="text"
            value={currentCard.keywords.join(', ')}
            onChange={(e) => handleContentUpdate('keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入关键词，用逗号分隔"
          />
        </div>
      </div>
    );
  };

  // 渲染样式编辑
  const renderStyleEditor = () => {
    if (!currentCard) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              背景颜色
            </label>
            <input
              type="color"
              value={currentCard.style.backgroundColor}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文字颜色
            </label>
            <input
              type="color"
              value={currentCard.style.textColor}
              onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            字体大小
          </label>
          <select
            value={currentCard.style.fontSize}
            onChange={(e) => handleStyleUpdate('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            字体粗细
          </label>
          <select
            value={currentCard.style.fontWeight}
            onChange={(e) => handleStyleUpdate('fontWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="normal">正常</option>
            <option value="bold">粗体</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            边框样式
          </label>
          <select
            value={currentCard.style.borderStyle}
            onChange={(e) => handleStyleUpdate('borderStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="none">无边框</option>
            <option value="solid">实线</option>
            <option value="dashed">虚线</option>
            <option value="dotted">点线</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            边框颜色
          </label>
          <input
            type="color"
            value={currentCard.style.borderColor}
            onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            圆角大小
          </label>
          <select
            value={currentCard.style.borderRadius}
            onChange={(e) => handleStyleUpdate('borderRadius', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="none">无圆角</option>
            <option value="small">小圆角</option>
            <option value="medium">中圆角</option>
            <option value="large">大圆角</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            阴影效果
          </label>
          <select
            value={currentCard.style.shadow}
            onChange={(e) => handleStyleUpdate('shadow', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="none">无阴影</option>
            <option value="small">小阴影</option>
            <option value="medium">中阴影</option>
            <option value="large">大阴影</option>
          </select>
        </div>
      </div>
    );
  };

  // 渲染模板选择
  const renderTemplateSelector = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">选择一个模板来快速应用样式</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleApplyTemplate(template.id)}
            className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <PageLoading text="加载卡片中..." />;
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">卡片不存在</h2>
          <p className="text-gray-600 mb-4">您要编辑的卡片不存在或已被删除</p>
          <button
            onClick={() => navigate('/portfolio')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            返回作品集
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/portfolio')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回作品集
              </button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">编辑卡片</h1>
                {isModified && (
                  <p className="text-sm text-orange-600">有未保存的更改</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isDeleting ? '删除中...' : '删除'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={!isModified || isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              >
                {isSaving ? (
                  <>
                    <InlineLoading />
                    <span className="ml-2">保存中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    保存
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 编辑面板 */}
          <div className="space-y-6">
            {/* 标签页 */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'content'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    内容编辑
                  </button>
                  <button
                    onClick={() => setActiveTab('style')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'style'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    样式设置
                  </button>
                  <button
                    onClick={() => setActiveTab('template')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'template'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    模板应用
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'content' && renderContentEditor()}
                {activeTab === 'style' && renderStyleEditor()}
                {activeTab === 'template' && renderTemplateSelector()}
              </div>
            </div>
          </div>

          {/* 预览面板 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">实时预览</h2>
              <div className="flex justify-center">
                <CardPreview
                  card={currentCard}
                  className="max-w-sm"
                  showActions={true}
                  enableImageExport={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">确认删除</h3>
            <p className="text-gray-600 mb-6">
              您确定要删除这张卡片吗？此操作无法撤销。
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isDeleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;