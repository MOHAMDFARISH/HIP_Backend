
import React, { useState } from 'react';
import { Order, OrderStatus, EmailContent } from '../types';
import { useGemini } from '../hooks/useGemini';
import StatusDropdown from './StatusDropdown';
import ReceiptModal from './ReceiptModal';
import NotificationPreviewModal from './NotificationPreviewModal';
import OrderDetailsModal from './OrderDetailsModal';
import { Eye, CheckCircle, XCircle, Mail, Loader2, FileText, Edit2, Trash2, DollarSign } from 'lucide-react';

interface OrderRowProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<boolean>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onEditPrice: (order: Order) => void;
}

const NOTIFIABLE_STATUSES: OrderStatus[] = [
  OrderStatus.Confirmed,
  OrderStatus.ReadyForPickup,
  OrderStatus.Shipped,
  OrderStatus.Cancelled,
];

const OrderRow: React.FC<OrderRowProps> = ({ order, onStatusUpdate, onDeleteOrder, onEditPrice }) => {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState<EmailContent | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { generateOrderStatusEmail, loading: isGeneratingEmail, error: geminiError } = useGemini();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    await onStatusUpdate(order.id, newStatus);
    setIsUpdatingStatus(false);
  };

  const handleNotifyClick = async () => {
    if (!NOTIFIABLE_STATUSES.includes(order.status)) {
        alert("This order status is not notifiable.");
        return;
    }
    const content = await generateOrderStatusEmail(order.customer_name, order.status, order.tracking_number);
    if (content) {
        setEmailContent(content);
        setIsNotificationModalOpen(true);
    } else {
        alert(`Error generating email: ${geminiError || 'Unknown error'}`);
    }
  };

  const handleSendNotification = () => {
    // In a real app, this would trigger an API call to a backend to send the email.
    console.log("Sending email:", emailContent);
    alert(`Email notification sent to ${order.customer_email}`);
    setIsNotificationModalOpen(false);
    setEmailContent(null);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete order ${order.tracking_number}? This action cannot be undone.`)) {
      await onDeleteOrder(order.id);
    }
  };

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isNotifiable = NOTIFIABLE_STATUSES.includes(order.status);

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
          <div className="text-green-600 font-medium">
            Rf {order.price_per_book?.toFixed(2) || '0.00'}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-green-600 font-semibold">
            Rf {order.total_price?.toFixed(2) || '0.00'}
          </div>
        </td>
        <td className="px-6 py-4">
          <StatusDropdown
            currentStatus={order.status}
            onChange={handleStatusChange}
            disabled={isUpdatingStatus}
          />
        </td>
        <td className="px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                    onClick={() => setIsOrderDetailsModalOpen(true)}
                    className="inline-flex items-center justify-center p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                    title="View Order Details"
                    aria-label="View Order Details"
                >
                    <FileText className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onEditPrice(order)}
                    className="inline-flex items-center justify-center p-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                    title="Edit Price"
                    aria-label="Edit Price"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                {order.receipt_file_url && (
                    <button
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                        title="View Receipt"
                    >
                        <Eye className="w-3 h-3"/>
                        Receipt
                    </button>
                )}
                <button
                    onClick={handleNotifyClick}
                    disabled={!isNotifiable || isGeneratingEmail}
                    className="inline-flex items-center justify-center p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                    title={isNotifiable ? "Notify Customer" : "Status not notifiable"}
                    aria-label="Notify Customer"
                >
                    {isGeneratingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                </button>
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center p-2 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                    title="Delete Order"
                    aria-label="Delete Order"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </td>
      </tr>
      {isReceiptModalOpen && order.receipt_file_url && (
        <ReceiptModal
          imageUrl={order.receipt_file_url}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
      {isNotificationModalOpen && emailContent && (
        <NotificationPreviewModal
            isOpen={isNotificationModalOpen}
            onClose={() => setIsNotificationModalOpen(false)}
            onSend={handleSendNotification}
            recipientEmail={order.customer_email}
            subject={emailContent.subject}
            body={emailContent.body}
        />
      )}
      {isOrderDetailsModalOpen && (
        <OrderDetailsModal
          order={order}
          onClose={() => setIsOrderDetailsModalOpen(false)}
        />
      )}
    </>
  );
};

export default OrderRow;
