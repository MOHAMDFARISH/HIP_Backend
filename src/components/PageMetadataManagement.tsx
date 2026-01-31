import React, { useState, useEffect } from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { PageMetadata } from '../types';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Globe, Image as ImageIcon, FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const PageMetadataManagement: React.FC = () => {
  const { pageMetadata, loading, error, fetchPageMetadata, createPageMetadata, updatePageMetadata, deletePageMetadata, toggleActive } = usePageMetadata();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PageMetadata | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<Partial<PageMetadata>>({
    page_id: '',
    page_name: '',
    page_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'website',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    favicon_url: '',
    robots: 'index, follow',
    structured_data: null,
    custom_head_tags: '',
    is_active: true,
  });
  const [keywordsInput, setKeywordsInput] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPageMetadata(searchTerm, activeFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeFilter, fetchPageMetadata]);

  const handleOpenModal = (item?: PageMetadata) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setKeywordsInput(item.meta_keywords?.join(', ') || '');
    } else {
      setEditingItem(null);
      setFormData({
        page_id: '',
        page_name: '',
        page_title: '',
        meta_description: '',
        meta_keywords: [],
        og_title: '',
        og_description: '',
        og_image: '',
        og_type: 'website',
        twitter_card: 'summary_large_image',
        twitter_title: '',
        twitter_description: '',
        twitter_image: '',
        canonical_url: '',
        favicon_url: '',
        robots: 'index, follow',
        structured_data: null,
        custom_head_tags: '',
        is_active: true,
      });
      setKeywordsInput('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k);
    const dataToSubmit = {
      ...formData,
      meta_keywords: keywords,
    };

    const success = editingItem
      ? await updatePageMetadata(editingItem.id, dataToSubmit)
      : await createPageMetadata(dataToSubmit);

    if (success) {
      handleCloseModal();
      fetchPageMetadata(searchTerm, activeFilter);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page metadata entry?')) {
      await deletePageMetadata(id);
    }
  };

  const handleToggleActive = async (item: PageMetadata) => {
    await toggleActive(item.id, !item.is_active);
  };

  const toggleRowExpanded = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filterOptions = [
    { value: 'all', label: 'All Pages' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const ImagePreview: React.FC<{ url: string | null | undefined; label: string; size?: 'sm' | 'md' }> = ({ url, label, size = 'sm' }) => {
    if (!url) return <span className="text-gray-400 text-xs italic">Not set</span>;

    const sizeClasses = size === 'sm' ? 'w-16 h-10' : 'w-32 h-20';

    return (
      <div className="flex items-center gap-2">
        <div className={`${sizeClasses} bg-gray-100 rounded overflow-hidden flex-shrink-0`}>
          <img
            src={url}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline truncate max-w-[150px]"
          title={url}
        >
          {url.split('/').pop() || 'View'}
        </a>
      </div>
    );
  };

  const MetadataDetail: React.FC<{ label: string; value: string | null | undefined; isUrl?: boolean }> = ({ label, value, isUrl }) => (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      {value ? (
        isUrl ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
            {value}
          </a>
        ) : (
          <span className="text-sm text-gray-900 line-clamp-2">{value}</span>
        )
      ) : (
        <span className="text-sm text-gray-400 italic">Not set</span>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Page Metadata (SEO)</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
        >
          <Plus className="w-4 h-4" />
          New Page Metadata
        </button>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by page name, ID, or title..."
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
              onClick={() => setActiveFilter(option.value as 'all' | 'active' | 'inactive')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                activeFilter === option.value
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
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : pageMetadata.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No page metadata entries found</p>
            <p className="text-sm">Click "New Page Metadata" to add your first entry</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pageMetadata.map((item) => (
              <div key={item.id} className="bg-white hover:bg-gray-50">
                {/* Main Row */}
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleRowExpanded(item.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.page_name}</h3>
                            <span className="px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-600 rounded">
                              {item.page_id}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {item.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.page_title}</p>
                        </div>
                      </div>

                      {/* Quick Preview Row */}
                      <div className="mt-3 flex items-center gap-6 ml-8">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">OG Image:</span>
                          <ImagePreview url={item.og_image} label="OG Image" />
                        </div>
                        {item.favicon_url && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Favicon:</span>
                            <img src={item.favicon_url} alt="Favicon" className="w-4 h-4" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`p-2 rounded ${
                          item.is_active
                            ? 'text-green-600 hover:bg-green-100'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={item.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRows.has(item.id) && (
                  <div className="px-6 pb-4 ml-8 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Basic SEO */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 border-b pb-1">Basic SEO</h4>
                        <MetadataDetail label="Page Title" value={item.page_title} />
                        <MetadataDetail label="Meta Description" value={item.meta_description} />
                        <MetadataDetail label="Meta Keywords" value={item.meta_keywords?.join(', ')} />
                        <MetadataDetail label="Robots" value={item.robots} />
                        <MetadataDetail label="Canonical URL" value={item.canonical_url} isUrl />
                      </div>

                      {/* Open Graph */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 border-b pb-1">Open Graph</h4>
                        <MetadataDetail label="OG Title" value={item.og_title} />
                        <MetadataDetail label="OG Description" value={item.og_description} />
                        <MetadataDetail label="OG Type" value={item.og_type} />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-500">OG Image</span>
                          <ImagePreview url={item.og_image} label="OG Image" size="md" />
                        </div>
                      </div>

                      {/* Twitter Card */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 border-b pb-1">Twitter Card</h4>
                        <MetadataDetail label="Card Type" value={item.twitter_card} />
                        <MetadataDetail label="Twitter Title" value={item.twitter_title} />
                        <MetadataDetail label="Twitter Description" value={item.twitter_description} />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-500">Twitter Image</span>
                          <ImagePreview url={item.twitter_image} label="Twitter Image" size="md" />
                        </div>
                      </div>

                      {/* Additional */}
                      <div className="space-y-3 md:col-span-2 lg:col-span-3">
                        <h4 className="font-semibold text-gray-700 border-b pb-1">Additional</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500">Favicon</span>
                            <ImagePreview url={item.favicon_url} label="Favicon" />
                          </div>
                          <MetadataDetail label="Structured Data" value={item.structured_data ? 'Configured' : null} />
                          <MetadataDetail label="Custom Head Tags" value={item.custom_head_tags ? 'Configured' : null} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Page Metadata' : 'Add New Page Metadata'}
              </h3>
              <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">Basic Information</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Page ID *</label>
                      <input
                        type="text"
                        value={formData.page_id}
                        onChange={(e) => setFormData({ ...formData, page_id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        placeholder="e.g., home, about, contact"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                      />
                      <span className="text-xs text-gray-500">Unique identifier (lowercase, no spaces)</span>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Page Name *</label>
                      <input
                        type="text"
                        value={formData.page_name}
                        onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                        placeholder="e.g., Home Page, About Us"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Page Title *</label>
                      <input
                        type="text"
                        value={formData.page_title}
                        onChange={(e) => setFormData({ ...formData, page_title: e.target.value })}
                        placeholder="Title shown in browser tab"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">SEO Settings</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Meta Description</label>
                      <textarea
                        value={formData.meta_description || ''}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        placeholder="Brief description for search engines (150-160 characters recommended)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        rows={3}
                        maxLength={320}
                      />
                      <span className="text-xs text-gray-500">{(formData.meta_description || '').length}/320 characters</span>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Meta Keywords</label>
                      <input
                        type="text"
                        value={keywordsInput}
                        onChange={(e) => setKeywordsInput(e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                      <span className="text-xs text-gray-500">Separate keywords with commas</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Robots</label>
                        <select
                          value={formData.robots}
                          onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                          <option value="index, follow">Index, Follow (default)</option>
                          <option value="noindex, follow">No Index, Follow</option>
                          <option value="index, nofollow">Index, No Follow</option>
                          <option value="noindex, nofollow">No Index, No Follow</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Canonical URL</label>
                        <input
                          type="url"
                          value={formData.canonical_url || ''}
                          onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                          placeholder="https://example.com/page"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Graph */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">Open Graph (Social Sharing)</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">OG Title</label>
                      <input
                        type="text"
                        value={formData.og_title || ''}
                        onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                        placeholder="Title for social sharing"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">OG Type</label>
                      <select
                        value={formData.og_type}
                        onChange={(e) => setFormData({ ...formData, og_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                        <option value="book">Book</option>
                        <option value="profile">Profile</option>
                        <option value="product">Product</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">OG Description</label>
                      <textarea
                        value={formData.og_description || ''}
                        onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                        placeholder="Description for social sharing"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">OG Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.og_image || ''}
                          onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        {formData.og_image && (
                          <a href={formData.og_image} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      {formData.og_image && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-500 block mb-1">Preview:</span>
                          <img
                            src={formData.og_image}
                            alt="OG Preview"
                            className="max-w-xs max-h-32 object-contain rounded"
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                          />
                        </div>
                      )}
                      <span className="text-xs text-gray-500">Recommended: 1200x630px for optimal display</span>
                    </div>
                  </div>
                </div>

                {/* Twitter Card */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">Twitter Card</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Card Type</label>
                      <select
                        value={formData.twitter_card}
                        onChange={(e) => setFormData({ ...formData, twitter_card: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Twitter Title</label>
                      <input
                        type="text"
                        value={formData.twitter_title || ''}
                        onChange={(e) => setFormData({ ...formData, twitter_title: e.target.value })}
                        placeholder="Title for Twitter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Twitter Description</label>
                      <textarea
                        value={formData.twitter_description || ''}
                        onChange={(e) => setFormData({ ...formData, twitter_description: e.target.value })}
                        placeholder="Description for Twitter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Twitter Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.twitter_image || ''}
                          onChange={(e) => setFormData({ ...formData, twitter_image: e.target.value })}
                          placeholder="https://example.com/twitter-image.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        {formData.twitter_image && (
                          <a href={formData.twitter_image} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      {formData.twitter_image && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-500 block mb-1">Preview:</span>
                          <img
                            src={formData.twitter_image}
                            alt="Twitter Preview"
                            className="max-w-xs max-h-32 object-contain rounded"
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">Additional Settings</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Favicon URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.favicon_url || ''}
                          onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                          placeholder="https://example.com/favicon.ico"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        {formData.favicon_url && (
                          <img src={formData.favicon_url} alt="Favicon" className="w-8 h-8" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Active (metadata will be used)</span>
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Custom Head Tags</label>
                      <textarea
                        value={formData.custom_head_tags || ''}
                        onChange={(e) => setFormData({ ...formData, custom_head_tags: e.target.value })}
                        placeholder='<meta name="custom" content="value">'
                        className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        rows={3}
                      />
                      <span className="text-xs text-gray-500">Raw HTML to be injected in the head section</span>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Structured Data (JSON-LD)</label>
                      <textarea
                        value={formData.structured_data ? JSON.stringify(formData.structured_data, null, 2) : ''}
                        onChange={(e) => {
                          try {
                            const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                            setFormData({ ...formData, structured_data: parsed });
                          } catch {
                            // Allow invalid JSON while typing
                          }
                        }}
                        placeholder='{"@context": "https://schema.org", "@type": "WebPage"}'
                        className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        rows={4}
                      />
                      <span className="text-xs text-gray-500">JSON-LD structured data for rich search results</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
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
                    {editingItem ? 'Update Metadata' : 'Create Metadata'}
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

export default PageMetadataManagement;
