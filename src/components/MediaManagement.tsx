import React, { useState, useEffect } from 'react';
import { useMediaItems } from '../hooks/useMediaItems';
import { MediaItem } from '../types';
import { Search, Plus, Edit, Trash2, Star, Video, Mic, Image as ImageIcon } from 'lucide-react';

const MediaManagement: React.FC = () => {
  const { mediaItems, loading, error, fetchMediaItems, createMediaItem, updateMediaItem, deleteMediaItem } = useMediaItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: '',
    description: '',
    media_type: 'video',
    source_type: 'youtube',
    embed_url: '',
    external_url: '',
    thumbnail_url: '',
    source_name: '',
    duration_minutes: null,
    is_featured: false,
    is_published: false,
    display_order: 0,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMediaItems(searchTerm, mediaTypeFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, mediaTypeFilter, fetchMediaItems]);

  const handleOpenModal = (item?: MediaItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        media_type: 'video',
        source_type: 'youtube',
        embed_url: '',
        external_url: '',
        thumbnail_url: '',
        source_name: '',
        duration_minutes: null,
        is_featured: false,
        is_published: false,
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = editingItem
      ? await updateMediaItem(editingItem.id, formData)
      : await createMediaItem(formData);

    if (success) {
      handleCloseModal();
      fetchMediaItems(searchTerm, mediaTypeFilter);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      await deleteMediaItem(id);
    }
  };

  const handleToggleFeatured = async (item: MediaItem) => {
    await updateMediaItem(item.id, { is_featured: !item.is_featured });
  };

  const mediaTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'video', label: 'Videos' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'interview', label: 'Interviews' },
  ];

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'podcast':
        return <Mic className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Media Library</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
        >
          <Plus className="w-4 h-4" />
          New Media
        </button>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm font-medium text-gray-600">Filter by type:</span>
          {mediaTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setMediaTypeFilter(option.value)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                mediaTypeFilter === option.value
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
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Source</th>
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
              ) : mediaItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No media items found</td>
                </tr>
              ) : (
                mediaItems.map((item) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {item.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getMediaIcon(item.media_type)}
                        <span className="capitalize">{item.media_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.source_name || item.source_type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.display_order}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`p-2 rounded ${
                            item.is_featured
                              ? 'text-yellow-600 hover:bg-yellow-100'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={item.is_featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <Star className={`w-4 h-4 ${item.is_featured ? 'fill-yellow-600' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Media Item' : 'Add New Media'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Media Type *</label>
                    <select
                      value={formData.media_type}
                      onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    >
                      <option value="video">Video</option>
                      <option value="podcast">Podcast</option>
                      <option value="interview">Interview</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Source Type *</label>
                    <select
                      value={formData.source_type}
                      onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    >
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="spotify">Spotify</option>
                      <option value="external">External</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Embed URL</label>
                    <input
                      type="url"
                      value={formData.embed_url || ''}
                      onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">External URL</label>
                    <input
                      type="url"
                      value={formData.external_url || ''}
                      onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Thumbnail URL</label>
                    <input
                      type="url"
                      value={formData.thumbnail_url || ''}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Source Name</label>
                    <input
                      type="text"
                      value={formData.source_name || ''}
                      onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration_minutes || ''}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || null })}
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
                      <span className="text-sm font-medium text-gray-700">Featured Item</span>
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
                    {editingItem ? 'Update' : 'Create'}
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

export default MediaManagement;
