import React, { useState, useEffect } from 'react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { BlogPost } from '../types';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, FileText, ExternalLink } from 'lucide-react';

const BlogPostsManagement: React.FC = () => {
  const { blogPosts, loading, error, fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: 'Hawla Riza',
    meta_description: '',
    tags: [],
    meta_keywords: [],
    is_published: false,
    is_external: false,
    external_url: '',
    external_source: '',
    post_type: 'article',
    read_time_minutes: null,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBlogPosts(searchTerm, publishedFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, publishedFilter, fetchBlogPosts]);

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        author: 'Hawla Riza',
        meta_description: '',
        tags: [],
        meta_keywords: [],
        is_published: false,
        is_external: false,
        external_url: '',
        external_source: '',
        post_type: 'article',
        read_time_minutes: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = editingPost
      ? await updateBlogPost(editingPost.id, formData)
      : await createBlogPost({ ...formData, published_date: new Date().toISOString() });

    if (success) {
      handleCloseModal();
      fetchBlogPosts(searchTerm, publishedFilter);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      await deleteBlogPost(id);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    await updateBlogPost(post.id, { is_published: !post.is_published });
  };

  const filterOptions = [
    { value: 'all' as const, label: 'All Posts' },
    { value: 'published' as const, label: 'Published' },
    { value: 'draft' as const, label: 'Drafts' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, slug, or author..."
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
              onClick={() => setPublishedFilter(option.value)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                publishedFilter === option.value
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
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : blogPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No blog posts found</td>
                </tr>
              ) : (
                blogPosts.map((post) => (
                  <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {post.title}
                      <div className="text-xs text-gray-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {post.is_external ? (
                          <>
                            <ExternalLink className="w-3 h-3" />
                            <span className="text-xs">External</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3" />
                            <span className="text-xs">{post.post_type}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(post.published_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          title={post.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenModal(post)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Excerpt *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.is_external}
                        onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">External Post</span>
                    </label>
                  </div>
                  {formData.is_external ? (
                    <>
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
                        <label className="block mb-1 text-sm font-medium text-gray-700">External Source</label>
                        <input
                          type="text"
                          value={formData.external_source || ''}
                          onChange={(e) => setFormData({ ...formData, external_source: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        value={formData.content || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        rows={6}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Featured Image URL</label>
                    <input
                      type="url"
                      value={formData.featured_image || ''}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Read Time (minutes)</label>
                    <input
                      type="number"
                      value={formData.read_time_minutes || ''}
                      onChange={(e) => setFormData({ ...formData, read_time_minutes: parseInt(e.target.value) || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Meta Description *</label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Meta Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.meta_keywords?.join(', ') || ''}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Publish immediately</span>
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
                    {editingPost ? 'Update' : 'Create'}
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

export default BlogPostsManagement;
