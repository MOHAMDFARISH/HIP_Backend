
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Order, OrderStatus } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (searchTerm: string = '') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`tracking_number.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setOrders(data as Order[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        throw error;
      }
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update order status.');
      return false;
    }
  }, []);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  return { orders, loading, error, fetchOrders, updateOrderStatus };
};
