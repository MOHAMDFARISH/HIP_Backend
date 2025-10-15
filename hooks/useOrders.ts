import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Order, OrderStatus } from '../types';
import { PAGE_SIZE } from '../constants';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (searchTerm: string = '', page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (searchTerm) {
        query = query.or(`tracking_number.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      setOrders(data as Order[]);
      setOrderCount(count ?? 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders.');
      setOrders([]);
      setOrderCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      // Rely on the database trigger to handle the `updated_at` field.
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        throw error;
      }
      
      // Optimistically update the local state to reflect the change immediately.
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status, updated_at: new Date().toISOString() } : order
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update order status.');
      return false;
    }
  }, []);
  
  // Initial fetch is handled by the component.
  // useEffect(() => {
  //   fetchOrders();
  // }, [fetchOrders]);


  return { orders, orderCount, loading, error, fetchOrders, updateOrderStatus };
};
