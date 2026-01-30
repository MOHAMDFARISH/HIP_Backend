import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { MediaItem } from '../types';

export const useMediaItems = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaItems = useCallback(async (searchTerm: string = '', mediaTypeFilter: string = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('media_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (mediaTypeFilter !== 'all') {
        query = query.eq('media_type', mediaTypeFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setMediaItems(data as MediaItem[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch media items.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMediaItem = useCallback(async (mediaItem: Partial<MediaItem>): Promise<boolean> => {
    try {
      // Debug: Check auth status
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Creating media item - Auth status:', {
        isAuthenticated: !!session,
        userId: session?.user?.id,
        role: session?.user?.role,
      });

      const { error } = await supabase
        .from('media_items')
        .insert([mediaItem]);

      if (error) {
        console.error('Media item creation error:', error);
        throw error;
      }

      await fetchMediaItems();
      return true;
    } catch (err: any) {
      console.error('Failed to create media item:', err);
      setError(err.message || 'Failed to create media item.');
      return false;
    }
  }, [fetchMediaItems]);

  const updateMediaItem = useCallback(async (id: string, updates: Partial<MediaItem>): Promise<boolean> => {
    try {
      // Debug: Check auth status
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Updating media item - Auth status:', {
        isAuthenticated: !!session,
        userId: session?.user?.id,
        role: session?.user?.role,
        mediaItemId: id,
      });

      const { error } = await supabase
        .from('media_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Media item update error:', error);
        throw error;
      }

      setMediaItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
      return true;
    } catch (err: any) {
      console.error('Failed to update media item:', err);
      setError(err.message || 'Failed to update media item.');
      return false;
    }
  }, []);

  const deleteMediaItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setMediaItems(prevItems => prevItems.filter(item => item.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete media item.');
      return false;
    }
  }, []);

  return { mediaItems, loading, error, fetchMediaItems, createMediaItem, updateMediaItem, deleteMediaItem };
};
