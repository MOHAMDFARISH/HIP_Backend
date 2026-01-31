
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
  customer_phone: string;
  shipping_address: string;
  number_of_copies: number;
  join_event: boolean;
  bring_guest: boolean;
  receipt_file_url: string | null;
  status: OrderStatus;
  updated_at: string;
  price_per_book: number;
  total_price: number;
}

export interface EmailContent {
  subject: string;
  body: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  featured_image: string | null;
  author: string;
  published_date: string;
  updated_date: string | null;
  is_external: boolean;
  external_url: string | null;
  external_source: string | null;
  tags: string[];
  meta_description: string;
  meta_keywords: string[];
  read_time_minutes: number | null;
  is_published: boolean;
  views_count: number;
  created_at: string;
  post_type: string;
  content_blocks: any | null;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  source_type: string;
  embed_url: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  source_name: string | null;
  published_date: string | null;
  duration_minutes: number | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  views_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_title: string | null;
  review_text: string;
  rating: number | null;
  reviewer_photo: string | null;
  reviewer_location: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string | null;
}

export interface Gift {
  id: string;
  recipient_name: string;
  recipient_title: string | null;
  organization: string | null;
  number_of_books: number;
  date_gifted: string;
  occasion: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  price_per_book: number;
  total_price: number;
  is_sale: boolean;
}

export interface ConsignmentShop {
  id: string;
  shop_name: string;
  location: string;
  contact_person: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  books_placed: number;
  books_sold: number;
  books_remaining: number;
  last_payment_date: string | null;
  total_revenue: number;
  price_per_book: number;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface InventoryStock {
  id: string;
  books_in_stock: number;
  last_updated: string;
  updated_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface InventoryStats {
  totalOrders: number;
  totalBooksSold: number;
  totalBooksGifted: number;
  totalBooksInConsignment: number;
  totalBooksInStock: number;
  totalBooksDistributed: number;
  pendingOrders: number;
  revenueFromOrders: number;
  revenueFromGifts: number;
  revenueFromConsignment: number;
  totalRevenue: number;
}

export interface PageMetadata {
  id: string;
  page_id: string;
  page_name: string;
  page_title: string;
  meta_description: string | null;
  meta_keywords: string[];
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string;
  twitter_card: string;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  canonical_url: string | null;
  favicon_url: string | null;
  robots: string;
  structured_data: any | null;
  custom_head_tags: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}
