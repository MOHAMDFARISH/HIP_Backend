import React, { useState, useEffect } from 'react';
import { useGifts } from '../hooks/useGifts';
import { Gift } from '../types';
import { Search, Plus, Edit, Trash2, Gift as GiftIcon, Building2 } from 'lucide-react';

const GiftsManagement: React.FC = () => {
  const { gifts, loading, error, fetchGifts, createGift, updateGift, deleteGift } = useGifts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [formData, setFormData] = useState<Partial<Gift>>({
    recipient_name: '',
    recipient_title: '',
    organization: '',
    number_of_books: 1,
    date_gifted: new Date().toISOString().split('T')[0],
    occasion: '',
    notes: '',
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGifts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchGifts]);

  const handleOpenModal = (gift?: Gift) => {
    if (gift) {
      setEditingGift(gift);
      setFormData({
        ...gift,
        date_gifted: gift.date_gifted.split('T')[0], // Format for input type="date"
      });
    } else {
      setEditingGift(null);
      setFormData({
        recipient_name: '',
        recipient_title: '',
        organization: '',
        number_of_books: 1,
        date_gifted: new Date().toISOString().split('T')[0],
        occasion: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGift(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = editingGift
      ? await updateGift(editingGift.id, formData)
      : await createGift(formData);

    if (success) {
      handleCloseModal();
      fetchGifts(searchTerm);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gift record?')) {
      await deleteGift(id);
    }
  };

  const totalBooksGifted = gifts.reduce((sum, gift) => sum + gift.number_of_books, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gift Tracking</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total books gifted: <span className="font-semibold text-purple-600">{totalBooksGifted}</span>
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
        >
          <Plus className="w-4 h-4" />
          Record Gift
        </button>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by recipient, organization, or occasion..."
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
                <th className="px-6 py-3">Recipient</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Books</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Occasion</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : gifts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No gift records found</td>
                </tr>
              ) : (
                gifts.map((gift) => (
                  <tr key={gift.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <GiftIcon className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="font-medium text-gray-900">{gift.recipient_name}</div>
                          {gift.recipient_title && (
                            <div className="text-xs text-gray-500">{gift.recipient_title}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {gift.organization ? (
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          <span>{gift.organization}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {gift.number_of_books} {gift.number_of_books === 1 ? 'book' : 'books'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(gift.date_gifted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {gift.occasion || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(gift)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(gift.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                {editingGift ? 'Edit Gift Record' : 'Record New Gift'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Recipient Name *</label>
                    <input
                      type="text"
                      value={formData.recipient_name}
                      onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Title/Position</label>
                    <input
                      type="text"
                      value={formData.recipient_title || ''}
                      onChange={(e) => setFormData({ ...formData, recipient_title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="e.g., CEO, Minister, etc."
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Organization</label>
                    <input
                      type="text"
                      value={formData.organization || ''}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="Company or institution name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Number of Books *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.number_of_books}
                      onChange={(e) => setFormData({ ...formData, number_of_books: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Date Gifted *</label>
                    <input
                      type="date"
                      value={formData.date_gifted}
                      onChange={(e) => setFormData({ ...formData, date_gifted: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Occasion</label>
                    <input
                      type="text"
                      value={formData.occasion || ''}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="e.g., Business meeting, Conference, etc."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      rows={3}
                      placeholder="Additional notes or context..."
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
                    {editingGift ? 'Update' : 'Record Gift'}
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

export default GiftsManagement;
