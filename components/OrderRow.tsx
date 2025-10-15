import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import StatusDropdown from './StatusDropdown';
import ReceiptModal from './ReceiptModal';
import { Eye, CheckCircle, XCircle, FileText } from 'lucide-react';

interface OrderRowProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<boolean>;
  onViewDetails: (order: Order) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onStatusUpdate, onViewDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    await onStatusUpdate(order.id, newStatus);
    setIsUpdating(false);
  };
  
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          {order.tracking_number}
          <div className="text-xs font-normal text-gray-500">{formattedDate}</div>
        </td>
        <td className="px-6 py-4">
          {order.customer_name}
          <div className="text-xs text-gray-500">{order.customer_email}</div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {order.join_event ? <CheckCircle className="w-4 h-4 text-green-500"/> : <XCircle className="w-4 h-4 text-red-500" />}
            <span>{order.join_event ? 'Attending' : 'Delivery'}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-center">{order.number_of_copies}</td>
        <td className="px-6 py-4">
          <StatusDropdown
            currentStatus={order.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
          />
        </td>
        <td className="px-6 py-4 text-center">
          {order.receipt_file_url && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
              aria-label="View Receipt"
            >
              <Eye className="w-3 h-3"/>
              Receipt
            </button>
          )}
        </td>
        <td className="px-6 py-4 text-center">
            <button
              onClick={() => onViewDetails(order)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="View Order Details"
            >
              <FileText className="w-3 h-3"/>
              Details
            </button>
        </td>
      </tr>
      {isModalOpen && order.receipt_file_url && (
        <ReceiptModal
          imageUrl={order.receipt_file_url}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default OrderRow;