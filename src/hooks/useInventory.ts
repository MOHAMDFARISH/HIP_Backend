import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { InventoryStats } from '../types';

export const useInventory = () => {
  const [stats, setStats] = useState<InventoryStats>({
    totalOrders: 0,
    totalBooksSold: 0,
    totalBooksGifted: 0,
    totalBooksInConsignment: 0,
    totalBooksInInventory: 0,
    pendingOrders: 0,
    revenueFromConsignment: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('number_of_copies, status');

      if (ordersError) throw ordersError;

      // Fetch gifts data
      const { data: gifts, error: giftsError } = await supabase
        .from('gifts')
        .select('number_of_books');

      if (giftsError) throw giftsError;

      // Fetch consignment data
      const { data: shops, error: shopsError } = await supabase
        .from('consignment_shops')
        .select('books_placed, books_sold, books_remaining, total_revenue');

      if (shopsError) throw shopsError;

      // Calculate stats
      const totalOrders = orders?.length || 0;
      const totalBooksSold = orders?.reduce((sum, order) => sum + order.number_of_copies, 0) || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'pending_payment').length || 0;

      const totalBooksGifted = gifts?.reduce((sum, gift) => sum + gift.number_of_books, 0) || 0;

      const totalBooksInConsignment = shops?.reduce((sum, shop) => sum + shop.books_remaining, 0) || 0;
      const revenueFromConsignment = shops?.reduce((sum, shop) => sum + parseFloat(shop.total_revenue.toString()), 0) || 0;

      const totalBooksInInventory = totalBooksSold + totalBooksGifted + totalBooksInConsignment;

      setStats({
        totalOrders,
        totalBooksSold,
        totalBooksGifted,
        totalBooksInConsignment,
        totalBooksInInventory,
        pendingOrders,
        revenueFromConsignment,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory stats.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchInventoryStats };
};
