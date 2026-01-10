import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { InventoryStock } from '../types';

export const useInventoryStock = () => {
  const [stock, setStock] = useState<InventoryStock | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      setStock(data as InventoryStock);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory stock.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStock = useCallback(async (booksInStock: number, notes?: string): Promise<boolean> => {
    try {
      if (!stock) {
        // Create new record if none exists
        const { error } = await supabase
          .from('inventory_stock')
          .insert([{ books_in_stock: booksInStock, notes }]);

        if (error) throw error;
      } else {
        // Update existing record
        const { error } = await supabase
          .from('inventory_stock')
          .update({ books_in_stock: booksInStock, notes })
          .eq('id', stock.id);

        if (error) throw error;
      }

      await fetchStock();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update inventory stock.');
      return false;
    }
  }, [stock, fetchStock]);

  return { stock, loading, error, fetchStock, updateStock };
};
