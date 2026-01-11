import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { ConsignmentShop } from '../types';

export const useConsignment = () => {
  const [shops, setShops] = useState<ConsignmentShop[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = useCallback(async (searchTerm: string = '') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('consignment_shops')
        .select('*')
        .order('shop_name', { ascending: true });

      if (searchTerm) {
        query = query.or(`shop_name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setShops(data as ConsignmentShop[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consignment shops.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createShop = useCallback(async (shop: Partial<ConsignmentShop>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('consignment_shops')
        .insert([shop]);

      if (error) {
        throw error;
      }

      await fetchShops();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create consignment shop.');
      return false;
    }
  }, [fetchShops]);

  const updateShop = useCallback(async (id: string, updates: Partial<ConsignmentShop>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('consignment_shops')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setShops(prevShops =>
        prevShops.map(shop =>
          shop.id === id ? { ...shop, ...updates } : shop
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update consignment shop.');
      return false;
    }
  }, []);

  const deleteShop = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('consignment_shops')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setShops(prevShops => prevShops.filter(shop => shop.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete consignment shop.');
      return false;
    }
  }, []);

  const recordSale = useCallback(async (id: string, booksSold: number, revenue: number): Promise<boolean> => {
    try {
      // Fetch current shop data
      const { data: shop, error: fetchError } = await supabase
        .from('consignment_shops')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Calculate new values
      const newBooksSold = shop.books_sold + booksSold;
      const newTotalRevenue = parseFloat(shop.total_revenue.toString()) + revenue;
      const newBooksRemaining = shop.books_placed - newBooksSold;

      // Update with new values
      const { error: updateError } = await supabase
        .from('consignment_shops')
        .update({
          books_sold: newBooksSold,
          books_remaining: newBooksRemaining,
          total_revenue: newTotalRevenue,
          last_payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchShops();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to record sale.');
      return false;
    }
  }, [fetchShops]);

  const restockShop = useCallback(async (id: string, additionalBooks: number): Promise<boolean> => {
    try {
      // Fetch current shop data
      const { data: shop, error: fetchError } = await supabase
        .from('consignment_shops')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Calculate new values
      const newBooksPlaced = shop.books_placed + additionalBooks;
      const newBooksRemaining = newBooksPlaced - shop.books_sold;

      // Update with new values
      const { error: updateError } = await supabase
        .from('consignment_shops')
        .update({
          books_placed: newBooksPlaced,
          books_remaining: newBooksRemaining,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchShops();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to restock shop.');
      return false;
    }
  }, [fetchShops]);

  return { shops, loading, error, fetchShops, createShop, updateShop, deleteShop, recordSale, restockShop };
};
