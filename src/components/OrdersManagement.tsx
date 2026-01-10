import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import OrderTable from './OrderTable';
import { Search, BarChart, Plus } from 'lucide-react';
import { STATUS_OPTIONS } from '../constants';
import { OrderStatus, Order } from '../types';

const OrdersManagement: React.FC = () => {
  const { orders, loading, error, fetchOrders, updateOrderStatus, createOrder, updateOrder, deleteOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPriceEditModalOpen, setIsPriceEditModalOpen] = useState(false);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);
  const [priceFormData, setPriceFormData] = useState({
    price_per_book: 0,
    total_price: 0,
  });
  const [formData, setFormData] = useState<Partial<Order>>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    number_of_copies: 1,
    join_event: false,
    bring_guest: false,
    status: OrderStatus.Confirmed,
    price_per_book: 0,
    total_price: 0,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(searchTerm, statusFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, fetchOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenModal = () => {
    setFormData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      shipping_address: '',
      number_of_copies: 1,
      join_event: false,
      bring_guest: false,
      status: OrderStatus.Confirmed,
      price_per_book: 0,
      total_price: 0,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createOrder(formData);
    if (success) {
      handleCloseModal();
      fetchOrders(searchTerm, statusFilter);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const success = await deleteOrder(orderId);
    if (success) {
      fetchOrders(searchTerm, statusFilter);
    }
  };

  const handleEditPrice = (order: Order) => {
    setSelectedOrderForEdit(order);
    setPriceFormData({
      price_per_book: order.price_per_book || 0,
      total_price: order.total_price || 0,
    });
    setIsPriceEditModalOpen(true);
  };

  const handleClosePriceEditModal = () => {
    setIsPriceEditModalOpen(false);
    setSelectedOrderForEdit(null);
  };

  const handlePriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderForEdit) {
      const success = await updateOrder(selectedOrderForEdit.id, {
        price_per_book: priceFormData.price_per_book,
        total_price: priceFormData.total_price,
      });
      if (success) {
        handleClosePriceEditModal();
        fetchOrders(searchTerm, statusFilter);
      }
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'pending_payment').length;
  const totalBooksSold = orders.reduce((sum, order) => sum + order.number_of_copies, 0);

  const filterOptions: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...STATUS_OPTIONS,
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total books ordered: <span className="font-semibold text-blue-600">{totalBooksSold}</span>
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
        >
          <Plus className="w-4 h-4" />
          Add Manual Order
        </button>
      </div>

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
          onDeleteOrder={handleDeleteOrder}
          onEditPrice={handleEditPrice}
        />
      </div>

      {/* Manual Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Add Manual Order</h3>
              <p className="mb-4 text-sm text-gray-600">
                Use this form to add orders from social media, physical purchases, or other sources.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Customer Name *</label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Customer Email *</label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Customer Phone</label>
                    <input
                      type="tel"
                      value={formData.customer_phone || ''}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Number of Books *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.number_of_copies}
                      onChange={(e) => {
                        const copies = parseInt(e.target.value) || 1;
                        const totalPrice = (formData.price_per_book || 0) * copies;
                        setFormData({ ...formData, number_of_copies: copies, total_price: totalPrice });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Price Per Book ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price_per_book || 0}
                      onChange={(e) => {
                        const pricePerBook = parseFloat(e.target.value) || 0;
                        const totalPrice = pricePerBook * (formData.number_of_copies || 1);
                        setFormData({ ...formData, price_per_book: pricePerBook, total_price: totalPrice });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Total Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.total_price || 0}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Shipping Address</label>
                    <textarea
                      value={formData.shipping_address || ''}
                      onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      rows={2}
                      placeholder="Leave blank if pickup at event"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Order Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.join_event}
                        onChange={(e) => setFormData({ ...formData, join_event: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Customer will attend event (pickup)</span>
                    </label>
                    {formData.join_event && (
                      <label className="flex items-center gap-2 ml-6">
                        <input
                          type="checkbox"
                          checked={formData.bring_guest}
                          onChange={(e) => setFormData({ ...formData, bring_guest: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Bringing a guest</span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Price Edit Modal */}
      {isPriceEditModalOpen && selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Edit Order Price</h3>
              <p className="mb-4 text-sm text-gray-600">
                Update the price for order <span className="font-semibold">{selectedOrderForEdit.tracking_number}</span>
              </p>
              <form onSubmit={handlePriceUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Number of Books
                    </label>
                    <input
                      type="number"
                      value={selectedOrderForEdit.number_of_copies}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Price Per Book ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceFormData.price_per_book}
                      onChange={(e) => {
                        const pricePerBook = parseFloat(e.target.value) || 0;
                        const totalPrice = pricePerBook * selectedOrderForEdit.number_of_copies;
                        setPriceFormData({ price_per_book: pricePerBook, total_price: totalPrice });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Total Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceFormData.total_price}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleClosePriceEditModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
                  >
                    Update Price
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
