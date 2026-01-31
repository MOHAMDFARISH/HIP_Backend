import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { PageMetadata } from '../types';

export const usePageMetadata = () => {
  const [pageMetadata, setPageMetadata] = useState<PageMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPageMetadata = useCallback(async (searchTerm: string = '', activeFilter: 'all' | 'active' | 'inactive' = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('page_metadata')
        .select('*')
        .order('page_name', { ascending: true });

      if (searchTerm) {
        query = query.or(`page_name.ilike.%${searchTerm}%,page_id.ilike.%${searchTerm}%,page_title.ilike.%${searchTerm}%`);
      }

      if (activeFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (activeFilter === 'inactive') {
        query = query.eq('is_active', false);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPageMetadata(data as PageMetadata[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch page metadata.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPageMetadata = useCallback(async (metadata: Partial<PageMetadata>): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Creating page metadata - Auth status:', {
        isAuthenticated: !!session,
        userId: session?.user?.id,
      });

      const { error } = await supabase
        .from('page_metadata')
        .insert([metadata]);

      if (error) {
        console.error('Page metadata creation error:', error);
        throw error;
      }

      await fetchPageMetadata();
      return true;
    } catch (err: any) {
      console.error('Failed to create page metadata:', err);
      setError(err.message || 'Failed to create page metadata.');
      return false;
    }
  }, [fetchPageMetadata]);

  const updatePageMetadata = useCallback(async (id: string, updates: Partial<PageMetadata>): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Updating page metadata - Auth status:', {
        isAuthenticated: !!session,
        userId: session?.user?.id,
        metadataId: id,
      });

      const { error } = await supabase
        .from('page_metadata')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Page metadata update error:', error);
        throw error;
      }

      setPageMetadata(prevMetadata =>
        prevMetadata.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
      return true;
    } catch (err: any) {
      console.error('Failed to update page metadata:', err);
      setError(err.message || 'Failed to update page metadata.');
      return false;
    }
  }, []);

  const deletePageMetadata = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('page_metadata')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPageMetadata(prevMetadata => prevMetadata.filter(item => item.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete page metadata.');
      return false;
    }
  }, []);

  const toggleActive = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    return updatePageMetadata(id, { is_active: isActive });
  }, [updatePageMetadata]);

  return {
    pageMetadata,
    loading,
    error,
    fetchPageMetadata,
    createPageMetadata,
    updatePageMetadata,
    deletePageMetadata,
    toggleActive
  };
};
