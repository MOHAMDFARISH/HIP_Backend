import React, { useState, useEffect } from 'react';
import { useReviews } from '../hooks/useReviews';
import { Review } from '../types';
import { Search, Plus, Edit, Trash2, Star, MapPin } from 'lucide-react';

const ReviewsManagement: React.FC = () => {
  const { reviews, loading, error, fetchReviews, createReview, updateReview, deleteReview } = useReviews();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'regular'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<Partial<Review>>({
    reviewer_name: '',
    reviewer_title: '',
    review_text: '',
    rating: 5,
    reviewer_photo: '',
    reviewer_location: '',
    is_featured: false,
    is_published: false,
    display_order: 0,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReviews(searchTerm, featuredFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, featuredFilter, fetchReviews]);

  const handleOpenModal = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData(review);
    } else {
      setEditingReview(null);
      setFormData({
        reviewer_name: '',
        reviewer_title: '',
        review_text: '',
        rating: 5,
        reviewer_photo: '',
        reviewer_location: '',
        is_featured: false,
        is_published: false,
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = editingReview
      ? await updateReview(editingReview.id, formData)
      : await createReview(formData);

    if (success) {
      handleCloseModal();
      fetchReviews(searchTerm, featuredFilter);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(id);
    }
  };

  const handleToggleFeatured = async (review: Review) => {
    await updateReview(review.id, { is_featured: !review.is_featured });
  };

  const filterOptions = [
    { value: 'all' as const, label: 'All Reviews' },
    { value: 'featured' as const, label: 'Featured' },
    { value: 'regular' as const, label: 'Regular' },
  ];

  const renderStars = (rating: number | null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= (rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
        >
          <Plus className="w-4 h-4" />
          New Review
        </button>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reviewer name or review text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFeaturedFilter(option.value)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                featuredFilter === option.value
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Reviewer</th>
                <th className="px-6 py-3">Review</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No reviews found</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {review.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        <div>
                          <div className="font-medium text-gray-900">{review.reviewer_name}</div>
                          {review.reviewer_title && (
                            <div className="text-xs text-gray-500">{review.reviewer_title}</div>
                          )}
                          {review.reviewer_location && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {review.reviewer_location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate">{review.review_text}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        review.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {review.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{review.display_order}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(review)}
                          className={`p-2 rounded ${
                            review.is_featured
                              ? 'text-yellow-600 hover:bg-yellow-100'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={review.is_featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <Star className={`w-4 h-4 ${review.is_featured ? 'fill-yellow-600' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(review)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
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
                {editingReview ? 'Edit Review' : 'Add New Review'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Reviewer Name *</label>
                    <input
                      type="text"
                      value={formData.reviewer_name}
                      onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Title/Position</label>
                    <input
                      type="text"
                      value={formData.reviewer_title || ''}
                      onChange={(e) => setFormData({ ...formData, reviewer_title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Review Text *</label>
                    <textarea
                      value={formData.review_text}
                      onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Rating (1-5)</label>
                    <select
                      value={formData.rating || 5}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={formData.reviewer_location || ''}
                      onChange={(e) => setFormData({ ...formData, reviewer_location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="e.g., New York, USA"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Photo URL</label>
                    <input
                      type="url"
                      value={formData.reviewer_photo || ''}
                      onChange={(e) => setFormData({ ...formData, reviewer_photo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Review</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
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
                    {editingReview ? 'Update' : 'Create'}
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

export default ReviewsManagement;
