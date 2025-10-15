import { OrderStatus } from './types';

export const PAGE_SIZE = 10;

export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: OrderStatus.PendingPayment, label: 'Pending Payment' },
  { value: OrderStatus.Pending, label: 'Pending Verification' },
  { value: OrderStatus.Confirmed, label: 'Confirmed' },
  { value: OrderStatus.ReadyForPickup, label: 'Ready for Pickup' },
  { value: OrderStatus.Shipped, label: 'Shipped' },
  { value: OrderStatus.Delivered, label: 'Delivered' },
  { value: OrderStatus.Cancelled, label: 'Cancelled' },
];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PendingPayment]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.Pending]: 'bg-blue-100 text-blue-800',
  [OrderStatus.Confirmed]: 'bg-green-100 text-green-800',
  [OrderStatus.ReadyForPickup]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.Shipped]: 'bg-purple-100 text-purple-800',
  [OrderStatus.Delivered]: 'bg-teal-100 text-teal-800',
  [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
};
