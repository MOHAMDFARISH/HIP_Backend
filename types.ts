
export enum OrderStatus {
  PendingPayment = 'pending_payment',
  Pending = 'pending',
  Confirmed = 'confirmed',
  ReadyForPickup = 'ready_for_pickup',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export interface Order {
  id: string;
  created_at: string;
  tracking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string | null;
  number_of_copies: number;
  join_event: boolean;
  bring_guest: boolean;
  receipt_file_url: string | null;
  status: OrderStatus;
  updated_at: string;
}
