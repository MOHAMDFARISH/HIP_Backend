import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Gift } from '../types';

export const useGifts = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGifts = useCallback(async (searchTerm: string = '') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('gifts')
        .select('*')
        .order('date_gifted', { ascending: false });

      if (searchTerm) {
        query = query.or(`recipient_name.ilike.%${searchTerm}%,organization.ilike.%${searchTerm}%,occasion.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setGifts(data as Gift[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch gifts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGift = useCallback(async (gift: Partial<Gift>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gifts')
        .insert([gift]);

      if (error) {
        throw error;
      }

      await fetchGifts();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create gift record.');
      return false;
    }
  }, [fetchGifts]);

  const updateGift = useCallback(async (id: string, updates: Partial<Gift>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gifts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setGifts(prevGifts =>
        prevGifts.map(gift =>
          gift.id === id ? { ...gift, ...updates } : gift
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update gift record.');
      return false;
    }
  }, []);

  const deleteGift = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setGifts(prevGifts => prevGifts.filter(gift => gift.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete gift record.');
      return false;
    }
  }, []);

  return { gifts, loading, error, fetchGifts, createGift, updateGift, deleteGift };
};
