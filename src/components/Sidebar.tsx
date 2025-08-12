import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Folder, Search, Tag, Calendar } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/create', icon: Plus, label: '创建卡片' },
    { path: '/portfolio', icon: Folder, label: '作品集' },
  ];

  const quickActions = [
    { icon: Search, label: '搜索卡片' },
    { icon: Tag, label: '标签管理' },
    { icon: Calendar, label: '最近创建' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            主要功能
          </h3>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            快捷操作
          </h3>
          {quickActions.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <button
                key={index}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Text2Card v1.0</p>
          <p className="mt-1">智能卡片生成工具</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;