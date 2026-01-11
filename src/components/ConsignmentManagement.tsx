import React, { useState, useEffect } from 'react';
import { useConsignment } from '../hooks/useConsignment';
import { ConsignmentShop } from '../types';
import { Search, Plus, Edit, Trash2, Store, Package, DollarSign, TrendingUp } from 'lucide-react';

const ConsignmentManagement: React.FC = () => {
  const { shops, loading, error, fetchShops, createShop, updateShop, deleteShop, recordSale, restockShop } = useConsignment();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<ConsignmentShop | null>(null);
  const [selectedShop, setSelectedShop] = useState<ConsignmentShop | null>(null);
  const [formData, setFormData] = useState<Partial<ConsignmentShop>>({
    shop_name: '',
    location: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    books_placed: 0,
    books_sold: 0,
    total_revenue: 0,
    notes: '',
  });
  const [saleData, setSaleData] = useState({ booksSold: 1, revenue: 0 });
  const [restockData, setRestockData] = useState({ additionalBooks: 1 });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchShops(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchShops]);

  const handleOpenModal = (shop?: ConsignmentShop) => {
    if (shop) {
      setEditingShop(shop);
      setFormData(shop);
    } else {
      setEditingShop(null);
      setFormData({
        shop_name: '',
        location: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        books_placed: 0,
        books_sold: 0,
        total_revenue: 0,
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShop(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = editingShop
      ? await updateShop(editingShop.id, formData)
      : await createShop(formData);

    if (success) {
      handleCloseModal();
      fetchShops(searchTerm);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this consignment shop?')) {
      await deleteShop(id);
    }
  };

  const handleOpenSaleModal = (shop: ConsignmentShop) => {
    setSelectedShop(shop);
    setSaleData({ booksSold: 1, revenue: 0 });
    setIsSaleModalOpen(true);
  };

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedShop) {
      const success = await recordSale(selectedShop.id, saleData.booksSold, saleData.revenue);
      if (success) {
        setIsSaleModalOpen(false);
        setSelectedShop(null);
      }
    }
  };

  const handleOpenRestockModal = (shop: ConsignmentShop) => {
    setSelectedShop(shop);
    setRestockData({ additionalBooks: 1 });
    setIsRestockModalOpen(true);
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedShop) {
      const success = await restockShop(selectedShop.id, restockData.additionalBooks);
      if (success) {
        setIsRestockModalOpen(false);
        setSelectedShop(null);
      }
    }
  };

  const totalBooksInConsignment = shops.reduce((sum, shop) => sum + shop.books_remaining, 0);
  const totalRevenue = shops.reduce((sum, shop) => sum + parseFloat(shop.total_revenue.toString()), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Consignment Shops</h2>
          <p className="text-sm text-gray-600 mt-1">
            Books in shops: <span className="font-semibold text-orange-600">{totalBooksInConsignment}</span>
            {' • '}
            Total revenue: <span className="font-semibold text-green-600">Rf {totalRevenue.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
        >
          <Plus className="w-4 h-4" />
          Add Shop
        </button>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by shop name, location, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
      </div>

      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Shop</th>
                <th className="px-6 py-3">Books</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Last Payment</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">No consignment shops found</td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="font-medium text-gray-900">{shop.shop_name}</div>
                          <div className="text-xs text-gray-500">{shop.location}</div>
                          {shop.contact_person && (
                            <div className="text-xs text-gray-400">Contact: {shop.contact_person}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Placed: {shop.books_placed}</div>
                        <div className="text-xs text-gray-500">Sold: {shop.books_sold}</div>
                        <div className="text-xs font-medium text-orange-600">Remaining: {shop.books_remaining}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-medium">Rf {parseFloat(shop.total_revenue.toString()).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {shop.last_payment_date ? (
                        new Date(shop.last_payment_date).toLocaleDateString()
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenSaleModal(shop)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded"
                          title="Record Sale"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenRestockModal(shop)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded"
                          title="Restock Books"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(shop)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(shop.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Shop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                {editingShop ? 'Edit Consignment Shop' : 'Add New Shop'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Shop Name *</label>
                    <input
                      type="text"
                      value={formData.shop_name}
                      onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contact_person || ''}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.contact_phone || ''}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contact_email || ''}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Initial Books Placed</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.books_placed}
                      onChange={(e) => setFormData({ ...formData, books_placed: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      rows={3}
                    />
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
                    {editingShop ? 'Update' : 'Add Shop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Record Sale Modal */}
      {isSaleModalOpen && selectedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Record Sale</h3>
              <p className="mb-4 text-sm text-gray-600">
                Shop: <strong>{selectedShop.shop_name}</strong>
              </p>
              <form onSubmit={handleRecordSale}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Books Sold *</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedShop.books_remaining}
                      value={saleData.booksSold}
                      onChange={(e) => setSaleData({ ...saleData, booksSold: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Available: {selectedShop.books_remaining} books</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Revenue Received (Rf) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={saleData.revenue}
                      onChange={(e) => setSaleData({ ...saleData, revenue: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsSaleModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Record Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && selectedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Restock Books</h3>
              <p className="mb-4 text-sm text-gray-600">
                Shop: <strong>{selectedShop.shop_name}</strong>
              </p>
              <form onSubmit={handleRestock}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Additional Books *</label>
                    <input
                      type="number"
                      min="1"
                      value={restockData.additionalBooks}
                      onChange={(e) => setRestockData({ additionalBooks: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Current inventory: {selectedShop.books_remaining} books</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsRestockModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700"
                  >
                    Restock
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

export default ConsignmentManagement;
