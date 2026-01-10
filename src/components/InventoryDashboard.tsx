import React, { useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Book, Gift, Store, Package, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

const InventoryDashboard: React.FC = () => {
  const { stats, loading, error, fetchInventoryStats } = useInventory();

  useEffect(() => {
    fetchInventoryStats();
  }, [fetchInventoryStats]);

  const StatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: number | string;
    bgColor: string;
    iconColor: string;
    subtitle?: string;
  }> = ({ icon: Icon, title, value, bgColor, iconColor, subtitle }) => (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${bgColor} rounded-full`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{loading ? '...' : value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Inventory Dashboard</h2>
        <p className="text-gray-600">Track all book movements and inventory statistics</p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Book}
          title="Total Books Distributed"
          value={stats.totalBooksInInventory}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          subtitle="Sold + Gifted + In Consignment"
        />

        <StatCard
          icon={Package}
          title="Books Sold (Orders)"
          value={stats.totalBooksSold}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          subtitle={`From ${stats.totalOrders} orders`}
        />

        <StatCard
          icon={Gift}
          title="Books Gifted"
          value={stats.totalBooksGifted}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          subtitle="Complimentary copies"
        />

        <StatCard
          icon={Store}
          title="Books in Consignment"
          value={stats.totalBooksInConsignment}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          subtitle="Currently at shops"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={AlertCircle}
          title="Pending Orders"
          value={stats.pendingOrders}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          subtitle="Awaiting payment/confirmation"
        />

        <StatCard
          icon={DollarSign}
          title="Consignment Revenue"
          value={`$${stats.revenueFromConsignment.toFixed(2)}`}
          bgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          subtitle="Total earned from shops"
        />

        <StatCard
          icon={TrendingUp}
          title="Total Orders"
          value={stats.totalOrders}
          bgColor="bg-indigo-100"
          iconColor="text-indigo-600"
          subtitle="All time orders"
        />
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Inventory Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm font-medium text-gray-600">Customer Orders</span>
            <span className="text-lg font-bold text-green-600">
              {loading ? '...' : `${((stats.totalBooksSold / stats.totalBooksInInventory) * 100 || 0).toFixed(1)}%`}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm font-medium text-gray-600">Gifts Given</span>
            <span className="text-lg font-bold text-purple-600">
              {loading ? '...' : `${((stats.totalBooksGifted / stats.totalBooksInInventory) * 100 || 0).toFixed(1)}%`}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm font-medium text-gray-600">In Shops</span>
            <span className="text-lg font-bold text-orange-600">
              {loading ? '...' : `${((stats.totalBooksInConsignment / stats.totalBooksInInventory) * 100 || 0).toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Stats are calculated from Orders, Gifts, and Consignment shops.
          Data updates automatically when you add or modify records in each section.
        </p>
      </div>
    </div>
  );
};

export default InventoryDashboard;
