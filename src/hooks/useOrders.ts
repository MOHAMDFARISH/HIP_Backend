import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Order, OrderStatus } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (searchTerm: string = '', statusFilter: OrderStatus | 'all' = 'all') => {
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

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
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

  const createOrder = useCallback(async (order: Partial<Order>): Promise<boolean> => {
    try {
      // Generate tracking number if not provided
      if (!order.tracking_number) {
        const timestamp = Date.now();
        order.tracking_number = `MANUAL-${timestamp}`;
      }

      const { error } = await supabase
        .from('orders')
        .insert([order]);

      if (error) {
        throw error;
      }

      await fetchOrders();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create order.');
      return false;
    }
  }, [fetchOrders]);

  const updateOrder = useCallback(async (orderId: string, updates: Partial<Order>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update order.');
      return false;
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete order.');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  return { orders, loading, error, fetchOrders, updateOrderStatus, createOrder, updateOrder, deleteOrder };
};