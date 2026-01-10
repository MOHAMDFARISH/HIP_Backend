# Pricing and Revenue Tracking - Implementation Guide

## ✅ What's Been Implemented

### 1. **Database Changes** (`pricing_inventory_migration.sql`)
- Added `price_per_book` and `total_price` columns to `orders` table
- Added `price_per_book`, `total_price`, and `is_sale` columns to `gifts` table
- Added `price_per_book` column to `consignment_shops` table
- Created `inventory_stock` table to track books on hand
- All with proper default values and constraints

### 2. **TypeScript Interfaces Updated**
- `Order` - Added price_per_book, total_price
- `Gift` - Added price_per_book, total_price, is_sale
- `ConsignmentShop` - Added price_per_book
- `InventoryStock` - New interface for tracking physical inventory
- `InventoryStats` - Enhanced with revenue tracking:
  - totalBooksInStock
  - totalBooksDistributed
  - revenueFromOrders
  - revenueFromGifts
  - revenueFromConsignment
  - totalRevenue

### 3. **New Hooks Created**
- `useInventoryStock` - Manage books in stock
- Updated `useInventory` - Now calculates revenue from all sources

## 🔧 Components That Need UI Updates

### 1. OrdersManagement Component
**Location:** `src/components/OrdersManagement.tsx`

**Add to the modal form (around line 164-252):**

```tsx
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">Price Per Book ($)</label>
  <input
    type="number"
    min="0"
    step="0.01"
    value={formData.price_per_book || 0}
    onChange={(e) => {
      const pricePerBook = parseFloat(e.target.value) || 0;
      const totalPrice = pricePerBook * (formData.number_of_copies || 1);
      setFormData({ ...formData, price_per_book: pricePerBook, total_price: totalPrice });
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
  />
</div>
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">Total Price ($)</label>
  <input
    type="number"
    min="0"
    step="0.01"
    value={formData.total_price || 0}
    readOnly
    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
  />
</div>
```

**Update formData initialization (around line 13-22):**
```tsx
const [formData, setFormData] = useState<Partial<Order>>({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  shipping_address: '',
  number_of_copies: 1,
  join_event: false,
  bring_guest: false,
  status: OrderStatus.Confirmed,
  price_per_book: 0,
  total_price: 0,
});
```

### 2. GiftsManagement Component
**Location:** `src/components/GiftsManagement.tsx`

**Add to the modal form (after number_of_books field):**

```tsx
<div className="md:col-span-2">
  <label className="flex items-center gap-2 mb-2">
    <input
      type="checkbox"
      checked={formData.is_sale}
      onChange={(e) => setFormData({ ...formData, is_sale: e.target.checked })}
      className="rounded"
    />
    <span className="text-sm font-medium text-gray-700">This was a discounted sale (not a true gift)</span>
  </label>
</div>

{formData.is_sale && (
  <>
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">Price Per Book ($)</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={formData.price_per_book || 0}
        onChange={(e) => {
          const pricePerBook = parseFloat(e.target.value) || 0;
          const totalPrice = pricePerBook * (formData.number_of_books || 1);
          setFormData({ ...formData, price_per_book: pricePerBook, total_price: totalPrice });
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">Total Price ($)</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={formData.total_price || 0}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
      />
    </div>
  </>
)}
```

**Update formData initialization:**
```tsx
const [formData, setFormData] = useState<Partial<Gift>>({
  recipient_name: '',
  recipient_title: '',
  organization: '',
  number_of_books: 1,
  date_gifted: new Date().toISOString().split('T')[0],
  occasion: '',
  notes: '',
  price_per_book: 0,
  total_price: 0,
  is_sale: false,
});
```

### 3. ConsignmentManagement Component
**Location:** `src/components/ConsignmentManagement.tsx`

**Add to "Record Sale" modal (around line 288-312):**

```tsx
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">Price Per Book ($) *</label>
  <input
    type="number"
    min="0"
    step="0.01"
    value={saleData.pricePerBook || 0}
    onChange={(e) => {
      const pricePerBook = parseFloat(e.target.value) || 0;
      const revenue = pricePerBook * (saleData.booksSold || 1);
      setSaleData({ ...saleData, pricePerBook, revenue });
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
    required
  />
</div>
```

**Update saleData state:**
```tsx
const [saleData, setSaleData] = useState({ booksSold: 1, revenue: 0, pricePerBook: 0 });
```

**Update handleRecordSale to pass pricePerBook:**
```tsx
const handleRecordSale = async (e: React.FormEvent) => {
  e.preventDefault();
  if (selectedShop) {
    const success = await recordSale(selectedShop.id, saleData.booksSold, saleData.revenue);
    if (success) {
      // Also update the shop's price_per_book
      await updateShop(selectedShop.id, { price_per_book: saleData.pricePerBook });
      setIsSaleModalOpen(false);
      setSelectedShop(null);
    }
  }
};
```

### 4. InventoryDashboard Component
**Location:** `src/components/InventoryDashboard.tsx`

**Replace the StatCard section (around line 65-90) with:**

```tsx
<div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
  <StatCard
    icon={Book}
    title="Books in Stock"
    value={stats.totalBooksInStock}
    bgColor="bg-indigo-100"
    iconColor="text-indigo-600"
    subtitle="Available for sale"
  />

  <StatCard
    icon={Package}
    title="Books Distributed"
    value={stats.totalBooksDistributed}
    bgColor="bg-blue-100"
    iconColor="text-blue-600"
    subtitle="Sold + Gifted + Consignment"
  />

  <StatCard
    icon={DollarSign}
    title="Total Revenue"
    value={`$${stats.totalRevenue.toFixed(2)}`}
    bgColor="bg-green-100"
    iconColor="text-green-600"
    subtitle="All sources"
  />

  <StatCard
    icon={TrendingUp}
    title="Order Revenue"
    value={`$${stats.revenueFromOrders.toFixed(2)}`}
    bgColor="bg-emerald-100"
    iconColor="text-emerald-600"
    subtitle="From customer orders"
  />
</div>

<div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
  <StatCard
    icon={Gift}
    title="Sale Revenue (Discounted)"
    value={`$${stats.revenueFromGifts.toFixed(2)}`}
    bgColor="bg-purple-100"
    iconColor="text-purple-600"
    subtitle="From discounted sales"
  />

  <StatCard
    icon={Store}
    title="Consignment Revenue"
    value={`$${stats.revenueFromConsignment.toFixed(2)}`}
    bgColor="bg-orange-100"
    iconColor="text-orange-600"
    subtitle="From shops"
  />

  <StatCard
    icon={AlertCircle}
    title="Pending Orders"
    value={stats.pendingOrders}
    bgColor="bg-yellow-100"
    iconColor="text-yellow-600"
    subtitle="Awaiting action"
  />
</div>
```

**Add Stock Update Section:**

```tsx
<div className="mt-6 p-6 bg-white rounded-lg shadow">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Inventory Stock</h3>
  <p className="text-sm text-gray-600 mb-4">
    Track how many physical books you currently have with you
  </p>
  <form onSubmit={handleUpdateStock} className="flex gap-4 items-end">
    <div className="flex-1">
      <label className="block mb-1 text-sm font-medium text-gray-700">Books in Stock</label>
      <input
        type="number"
        min="0"
        value={stockCount}
        onChange={(e) => setStockCount(parseInt(e.target.value) || 0)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
    </div>
    <div className="flex-1">
      <label className="block mb-1 text-sm font-medium text-gray-700">Notes (optional)</label>
      <input
        type="text"
        value={stockNotes}
        onChange={(e) => setStockNotes(e.target.value)}
        placeholder="e.g., Received new shipment"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
    </div>
    <button
      type="submit"
      className="px-6 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
    >
      Update Stock
    </button>
  </form>
</div>
```

**Add state and handlers at top of component:**

```tsx
const { stats, loading, error, fetchInventoryStats } = useInventory();
const { stock, updateStock } = useInventoryStock();
const [stockCount, setStockCount] = useState(0);
const [stockNotes, setStockNotes] = useState('');

useEffect(() => {
  fetchInventoryStats();
  // Load current stock
  if (stock) {
    setStockCount(stock.books_in_stock);
  }
}, [fetchInventoryStats, stock]);

const handleUpdateStock = async (e: React.FormEvent) => {
  e.preventDefault();
  const success = await updateStock(stockCount, stockNotes);
  if (success) {
    alert('Inventory stock updated successfully!');
    setStockNotes('');
    fetchInventoryStats(); // Refresh stats
  }
};
```

## 📊 How It Works

### Revenue Tracking:
1. **Orders** - Enter price when creating manual orders
2. **Gifts** - Check "discounted sale" box and enter price if sold at discount
3. **Consignment** - Enter price per book when recording sales
4. **Dashboard** - Automatically calculates total revenue from all sources

### Inventory Tracking:
1. Go to **Inventory Dashboard**
2. Update "Books in Stock" field with current physical count
3. Dashboard shows:
   - Books you have
   - Books distributed
   - Total revenue earned

## 🚀 Setup Steps

1. **Run both migrations** in Supabase SQL Editor:
   - `inventory_migration.sql`
   - `pricing_inventory_migration.sql`

2. **Apply the UI updates** above to each component

3. **Test the features**:
   - Add a manual order with pricing
   - Record a discounted sale as a gift
   - Record a consignment sale with price
   - Update inventory stock count
   - View revenue totals on dashboard

## 💡 Key Features

✅ **Variable Pricing** - Set different prices for different sales
✅ **Discount Tracking** - Mark discounted sales separately
✅ **Revenue Calculation** - Automatic total from all sources
✅ **Stock Management** - Track physical books on hand
✅ **Complete Visibility** - See where every dollar came from

All existing functionality remains intact!
