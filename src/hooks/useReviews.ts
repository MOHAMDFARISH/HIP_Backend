import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Review } from '../types';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (searchTerm: string = '', featuredFilter: 'all' | 'featured' | 'regular' = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`reviewer_name.ilike.%${searchTerm}%,review_text.ilike.%${searchTerm}%`);
      }

      if (featuredFilter === 'featured') {
        query = query.eq('is_featured', true);
      } else if (featuredFilter === 'regular') {
        query = query.eq('is_featured', false);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setReviews(data as Review[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReview = useCallback(async (review: Partial<Review>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([review]);

      if (error) {
        throw error;
      }

      await fetchReviews();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create review.');
      return false;
    }
  }, [fetchReviews]);

  const updateReview = useCallback(async (id: string, updates: Partial<Review>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === id ? { ...review, ...updates } : review
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update review.');
      return false;
    }
  }, []);

  const deleteReview = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete review.');
      return false;
    }
  }, []);

  return { reviews, loading, error, fetchReviews, createReview, updateReview, deleteReview };
};
