import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import CardPreview from '../components/CardPreview';
import { InlineLoading } from '../components/Loading';
import { Card } from '../types';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { recentCards, loadRecentCards, setCurrentCard } = useAppStore();
  const [quickText, setQuickText] = useState('');
  const [isCreating, setIsCreating] = useState(false);


  useEffect(() => {
    loadRecentCards();
  }, [loadRecentCards]);

  // 快速创建卡片
  const handleQuickCreate = () => {
    if (!quickText.trim()) return;
    
    setIsCreating(true);
    // 模拟创建过程
    setTimeout(() => {
      navigate('/create', { 
        state: { 
          inputContent: {
            type: 'text',
            content: quickText
          }
        }
      });
      setIsCreating(false);
    }, 500);
  };

  // 查看卡片详情
  const handleViewCard = (card: Card) => {
    console.log('=== handleViewCard 被调用 ===');
    console.log('卡片信息:', card);
    console.log('卡片ID:', card.id);
    console.log('当前URL:', window.location.href);
    console.log('即将导航到:', `/edit/${card.id}`);
    
    setCurrentCard(card);
    navigate(`/edit/${card.id}`);
    
    console.log('导航命令已执行');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 英雄区域 */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* 主标题 */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              将文本转换为
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                精美卡片
              </span>
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              智能分析文本内容，一键生成可视化卡片。支持多种模板，让信息传达更加直观高效。
            </p>

            {/* 快速开始 */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <textarea
                    value={quickText}
                    onChange={(e) => setQuickText(e.target.value)}
                    placeholder="输入您想要转换的文本内容..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleQuickCreate}
                    disabled={!quickText.trim() || isCreating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[120px]"
                  >
                    {isCreating ? (
                      <InlineLoading />
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        创建卡片
                      </>
                    )}
                  </button>
                  <Link
                    to="/create"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-center"
                  >
                    高级创建
                  </Link>
                </div>
              </div>
            </div>

            {/* 功能特色 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI智能分析</h3>
                <p className="text-gray-600">自动提取标题、摘要和关键词，智能理解内容结构</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">丰富模板</h3>
                <p className="text-gray-600">多种精美模板可选，适配不同场景和内容类型</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">便捷导出</h3>
                <p className="text-gray-600">支持多种格式导出，轻松分享和使用您的卡片</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 最近卡片 */}
      {recentCards.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">最近创建</h2>
            <Link
              to="/portfolio"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center transition-all duration-200 shadow-sm"
              onClick={(e) => {
                console.log('=== 查看全部链接被点击 ===');
                console.log('事件目标:', e.target);
                console.log('当前URL:', window.location.href);
                // 阻止事件冒泡，确保不会与卡片事件冲突
                e.stopPropagation();
              }}
            >
              查看全部作品
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCards.slice(0, 6).map((card) => (
              <div key={card.id} className="relative">
                <CardPreview
                  card={card}
                  onClick={(e) => {
                    console.log('=== CardPreview onClick 被触发 ===');
                    console.log('事件目标:', e?.target);
                    console.log('当前URL:', window.location.href);
                    
                    // 如果没有事件对象，直接执行导航
                    if (!e) {
                      console.log('没有事件对象，执行卡片导航');
                      handleViewCard(card);
                      return;
                    }
                    
                    const target = e.target as HTMLElement;
                    
                    // 简化的按钮检测：只检查是否点击了按钮或其子元素
                    const isButton = target.closest('button') !== null;
                    
                    if (isButton) {
                      console.log('点击了按钮，阻止卡片导航');
                      e.stopPropagation();
                      e.preventDefault();
                      return false;
                    }
                    
                    // 检查导出按钮标记（作为额外保险）
                    if ((window as any).__lastExportButtonClick && 
                        Date.now() - (window as any).__lastExportButtonClick < 500) {
                      console.log('检测到最近的导出按钮点击，阻止卡片导航');
                      e.stopPropagation();
                      e.preventDefault();
                      return false;
                    }
                    
                    // 执行卡片导航
                    console.log('执行卡片导航到编辑页面');
                    handleViewCard(card);
                  }}
                  className="h-full transition-transform duration-200 hover:scale-105"
                  showActions={true}
                  enableImageExport={true}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 开始使用 */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              立即体验Text2Card，让您的文本内容焕发新的活力
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                开始创建
              </Link>
              <Link
                to="/templates"
                className="px-8 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                浏览模板
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;