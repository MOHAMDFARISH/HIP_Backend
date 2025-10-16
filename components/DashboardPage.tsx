
import React, { useState, useCallback, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import OrderTable from './OrderTable';
import { Search, LogOut, BookOpen, BarChart } from 'lucide-react';

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'pending_payment').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200 sm:flex-row">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-brand-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Pre-Order Dashboard</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : totalOrders}</p>
                </div>
            </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                    <BarChart className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                    <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : pendingOrders}</p>
                </div>
            </div>
        </div>
      </div>


      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Tracking Number or Email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
      </div>
      
      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">{error}</div>}
      
      <div className="bg-white rounded-lg shadow">
        <OrderTable
          orders={orders}
          loading={loading}
          onStatusUpdate={updateOrderStatus}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
