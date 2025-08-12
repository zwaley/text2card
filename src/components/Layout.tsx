import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppStore } from '../store';
import { Loading } from './ui';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading, error } = useAppStore();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 全局加载状态 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-75 flex items-center justify-center">
          <Loading size="large" text="加载中..." />
        </div>
      )}
      
      {/* 头部导航 */}
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* 侧边栏 */}
        <Sidebar />
        
        {/* 主内容区域 */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* 全局错误提示 */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">错误</div>
                <div className="text-sm opacity-90">{error}</div>
              </div>
              <button
                onClick={() => useAppStore.getState().clearError()}
                className="ml-4 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast 通知 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
    </div>
  );
};

export default Layout;