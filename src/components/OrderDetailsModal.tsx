import React, { useEffect } from 'react';
import { Order } from '../types';
import { X, User, Mail, Phone, Home, Hash, Calendar, Book, Users, CheckCircle, XCircle } from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
        <Icon className="flex-shrink-0 w-5 h-5 mt-1 text-gray-500" />
        <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-base font-semibold text-gray-900">{value || 'N/A'}</p>
        </div>
    </div>
);

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="orderDetailsModalTitle"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] p-6 overflow-y-auto bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b">
            <div>
                <h2 id="orderDetailsModalTitle" className="text-xl font-bold text-gray-900">
                    Order Details
                </h2>
                <p className="text-sm text-gray-500">{order.tracking_number}</p>
            </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2">
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Customer Info</h3>
                <DetailItem icon={User} label="Name" value={order.customer_name} />
                <DetailItem icon={Mail} label="Email" value={order.customer_email} />
                <DetailItem icon={Phone} label="Phone" value={order.customer_phone} />
            </div>
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Order Info</h3>
                <DetailItem icon={Book} label="Copies" value={order.number_of_copies} />
                <DetailItem icon={Calendar} label="Order Date" value={formatDate(order.created_at)} />
                <DetailItem icon={Calendar} label="Last Updated" value={formatDate(order.updated_at)} />
            </div>
            <div className="md:col-span-2 space-y-6">
                 <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Event & Shipping</h3>
                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <DetailItem 
                        icon={order.join_event ? CheckCircle : XCircle} 
                        label="Attending Event" 
                        value={<span className={order.join_event ? 'text-green-600' : 'text-red-600'}>{order.join_event ? 'Yes' : 'No'}</span>} 
                    />
                    <DetailItem 
                        icon={Users} 
                        label="Bringing a Guest" 
                        value={<span className={order.bring_guest ? 'text-green-600' : 'text-red-600'}>{order.bring_guest ? 'Yes' : 'No'}</span>} 
                    />
                 </div>
                 {!order.join_event && (
                    <DetailItem icon={Home} label="Shipping Address" value={order.shipping_address} />
                 )}
            </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;