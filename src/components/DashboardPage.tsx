import React, { useState } from 'react';
import { LogOut, BookOpen, Package, FileText, Video, MessageSquare, BarChart3, Gift, Store } from 'lucide-react';
import OrdersManagement from './OrdersManagement';
import BlogPostsManagement from './BlogPostsManagement';
import MediaManagement from './MediaManagement';
import ReviewsManagement from './ReviewsManagement';
import InventoryDashboard from './InventoryDashboard';
import GiftsManagement from './GiftsManagement';
import ConsignmentManagement from './ConsignmentManagement';

interface DashboardPageProps {
  onLogout: () => void;
}

type TabType = 'inventory' | 'orders' | 'gifts' | 'consignment' | 'blog' | 'media' | 'reviews';

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');

  const tabs = [
    { id: 'inventory' as TabType, label: 'Inventory', icon: BarChart3 },
    { id: 'orders' as TabType, label: 'Orders', icon: Package },
    { id: 'gifts' as TabType, label: 'Gifts', icon: Gift },
    { id: 'consignment' as TabType, label: 'Consignment', icon: Store },
    { id: 'blog' as TabType, label: 'Blog', icon: FileText },
    { id: 'media' as TabType, label: 'Media', icon: Video },
    { id: 'reviews' as TabType, label: 'Reviews', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-brand-primary" />
              <h1 className="text-2xl font-bold text-gray-800">Content Management System</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-4 mb-6 bg-white rounded-lg shadow p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div>
          {activeTab === 'inventory' && <InventoryDashboard />}
          {activeTab === 'orders' && <OrdersManagement />}
          {activeTab === 'gifts' && <GiftsManagement />}
          {activeTab === 'consignment' && <ConsignmentManagement />}
          {activeTab === 'blog' && <BlogPostsManagement />}
          {activeTab === 'media' && <MediaManagement />}
          {activeTab === 'reviews' && <ReviewsManagement />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;