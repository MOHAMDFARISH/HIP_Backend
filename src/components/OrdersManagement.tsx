import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import OrderTable from './OrderTable';
import { Search, BarChart } from 'lucide-react';
import { STATUS_OPTIONS } from '../constants';
import { OrderStatus } from '../types';

const OrdersManagement: React.FC = () => {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(searchTerm, statusFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, fetchOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'pending_payment').length;

  const filterOptions: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...STATUS_OPTIONS,
  ];

  return (
    <div>
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

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
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
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm font-medium text-gray-600">Filter by status:</span>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                statusFilter === option.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
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

export default OrdersManagement;
