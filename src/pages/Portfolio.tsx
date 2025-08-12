import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore, usePortfolioStore } from '../store';
import CardPreview from '../components/CardPreview';
import { PageLoading, InlineLoading } from '../components/Loading';
import { searchCards, sortCards } from '../utils/cardUtils';
import { exportCardAsJSON } from '../utils/cardUtils';
import { Card, SortOption } from '../types';


const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { cards, isLoading, loadCards, removeCard, setCurrentCard } = useAppStore();
  const {
    viewMode,
    sortBy,
    selectedCards,
    setViewMode,
    setSortBy,
    toggleCardSelection,
    clearSelection,
    selectAllCards
  } = usePortfolioStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 加载卡片数据
  useEffect(() => {
    loadCards();
    

  }, [loadCards, cards.length]);

  // 处理搜索和排序
  useEffect(() => {
    let result = cards;
    
    // 搜索过滤
    if (searchQuery.trim()) {
      result = searchCards(result, searchQuery);
    }
    
    // 排序
    result = sortCards(result, sortBy);
    
    setFilteredCards(result);
  }, [cards, searchQuery, sortBy]);

  // 处理卡片点击
  const handleCardClick = (card: Card) => {
    if (selectedCards.length > 0) {
      // 选择模式下切换选中状态
      toggleCardSelection(card.id);
    } else {
      // 正常模式下进入编辑
      setCurrentCard(card);
      navigate(`/edit/${card.id}`);
    }
  };

  // 处理卡片长按（进入选择模式）
  const handleCardLongPress = (card: Card) => {
    toggleCardSelection(card.id);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedCards.length === 0) return;
    
    setIsDeleting(true);
    try {
      for (const cardId of selectedCards) {
        await removeCard(cardId);
      }
      clearSelection();
      setShowDeleteConfirm(false);
      alert(`成功删除 ${selectedCards.length} 张卡片`);
    } catch (error) {
      console.error('批量删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  // 批量导出
  const handleBatchExport = async () => {
    if (selectedCards.length === 0) return;
    
    setIsExporting(true);
    try {
      const selectedCardData = cards.filter(card => selectedCards.includes(card.id));
      
      if (selectedCardData.length === 1) {
        // 单张卡片导出
        const card = selectedCardData[0];
        const jsonData = exportCardAsJSON(card);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.title || 'card'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // 多张卡片打包导出
        const exportData = {
          cards: selectedCardData,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
        const jsonData = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cards_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      clearSelection();
      alert(`成功导出 ${selectedCards.length} 张卡片`);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  // 渲染工具栏
  const renderToolbar = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
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
              placeholder="搜索卡片..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center gap-4">
          {/* 视图模式切换 */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* 排序选择 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="createdAt-desc">创建时间（新到旧）</option>
            <option value="createdAt-asc">创建时间（旧到新）</option>
            <option value="updatedAt-desc">更新时间（新到旧）</option>
            <option value="updatedAt-asc">更新时间（旧到新）</option>
            <option value="title-asc">标题（A-Z）</option>
            <option value="title-desc">标题（Z-A）</option>
          </select>

          {/* 创建按钮 */}
          <Link
            to="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            创建卡片
          </Link>
        </div>
      </div>

      {/* 选择模式工具栏 */}
      {selectedCards.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                已选择 {selectedCards.length} 张卡片
              </span>
              <button
                onClick={() => selectAllCards(filteredCards.map(c => c.id))}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                全选
              </button>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                取消选择
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchExport}
                disabled={isExporting}
                className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              >
                {isExporting ? (
                  <>
                    <InlineLoading />
                    <span className="ml-1">导出中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    导出
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染网格视图
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredCards.map((card) => (
        <div key={card.id} className="group relative">
          <CardPreview
            card={card}
            onClick={(e) => {
              // 确保点击事件不是来自操作按钮
              if (e && e.target && (e.target as HTMLElement).closest('button')) {
                return;
              }
              handleCardClick(card);
            }}
            onLongPress={() => handleCardLongPress(card)}
            className={`h-full transition-all duration-200 cursor-pointer ${
              selectedCards.includes(card.id)
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'group-hover:scale-105 group-hover:shadow-lg'
            }`}
            showActions={selectedCards.length === 0}
            enableImageExport={true}
          />
          
          {/* 选择指示器 */}
          {selectedCards.includes(card.id) && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 渲染列表视图
  const renderListView = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedCards.length === filteredCards.length && filteredCards.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      selectAllCards(filteredCards.map(c => c.id));
                    } else {
                      clearSelection();
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                摘要
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                更新时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCards.includes(card.id)}
                    onChange={() => toggleCardSelection(card.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{card.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">{card.summary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(card.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(card.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleCardClick(card)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      toggleCardSelection(card.id);
                      setShowDeleteConfirm(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return <PageLoading text="加载卡片中..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的作品集</h1>
          <p className="text-gray-600">
            共 {filteredCards.length} 张卡片
            {searchQuery && ` · 搜索 "${searchQuery}"`}
          </p>
        </div>

        {/* 工具栏 */}
        {renderToolbar()}

        {/* 卡片列表 */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? '没有找到匹配的卡片' : '还没有创建任何卡片'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? '尝试使用其他关键词搜索' : '创建您的第一张卡片开始使用'}
            </p>
            {!searchQuery && (
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                创建第一张卡片
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-8">
            {viewMode === 'grid' ? renderGridView() : renderListView()}
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">确认删除</h3>
            <p className="text-gray-600 mb-6">
              您确定要删除选中的 {selectedCards.length} 张卡片吗？此操作无法撤销。
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                取消
              </button>
              <button
                onClick={handleBatchDelete}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <InlineLoading />
                    <span className="ml-2">删除中...</span>
                  </>
                ) : (
                  '确认删除'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;