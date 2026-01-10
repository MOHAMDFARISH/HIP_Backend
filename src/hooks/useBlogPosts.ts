import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { BlogPost } from '../types';

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = useCallback(async (searchTerm: string = '', publishedFilter: 'all' | 'published' | 'draft' = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
      }

      if (publishedFilter === 'published') {
        query = query.eq('is_published', true);
      } else if (publishedFilter === 'draft') {
        query = query.eq('is_published', false);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setBlogPosts(data as BlogPost[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBlogPost = useCallback(async (blogPost: Partial<BlogPost>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([blogPost]);

      if (error) {
        throw error;
      }

      await fetchBlogPosts();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post.');
      return false;
    }
  }, [fetchBlogPosts]);

  const updateBlogPost = useCallback(async (id: string, updates: Partial<BlogPost>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_date: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBlogPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === id ? { ...post, ...updates } : post
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update blog post.');
      return false;
    }
  }, []);

  const deleteBlogPost = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog post.');
      return false;
    }
  }, []);

  return { blogPosts, loading, error, fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost };
};
