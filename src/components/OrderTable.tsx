
import React from 'react';
import { Order, OrderStatus } from '../types';
import OrderRow from './OrderRow';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

const LoadingSkeleton: React.FC = () => (
    <>
        {[...Array(5)].map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="p-4"><div className="w-32 h-4 bg-gray-200 rounded"></div></td>
                <td className="p-4"><div className="w-24 h-4 bg-gray-200 rounded"></div></td>
                <td className="p-4"><div className="w-40 h-4 bg-gray-200 rounded"></div></td>
                <td className="p-4"><div className="w-16 h-4 bg-gray-200 rounded"></div></td>
                <td className="p-4"><div className="w-24 h-8 bg-gray-200 rounded-md"></div></td>
                <td className="p-4"><div className="w-24 h-8 bg-gray-200 rounded-md"></div></td>
            </tr>
        ))}
    </>
);

const OrderTable: React.FC<OrderTableProps> = ({ orders, loading, onStatusUpdate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Tracking #</th>
            <th scope="col" className="px-6 py-3">Customer</th>
            <th scope="col" className="px-6 py-3">Event</th>
            <th scope="col" className="px-6 py-3">Copies</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingSkeleton />
          ) : orders.length > 0 ? (
            orders.map(order => (
              <OrderRow key={order.id} order={order} onStatusUpdate={onStatusUpdate} />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
