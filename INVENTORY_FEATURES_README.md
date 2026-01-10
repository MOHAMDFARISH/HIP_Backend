# Inventory Management Features

This document explains the new inventory management features added to the CMS for tracking book distribution across multiple channels.

## 🎯 Features Added

### 1. **Inventory Dashboard**
- Comprehensive overview of all book movements
- Real-time statistics:
  - Total books distributed (sold + gifted + consignment)
  - Books sold through orders
  - Books given as gifts
  - Books currently in consignment shops
  - Pending orders count
  - Total consignment revenue
- Visual breakdown with percentages

### 2. **Gift Tracking**
Track books given to VIPs, officials, celebrities, and business partners:
- Recipient name and title
- Organization/company
- Number of books gifted
- Date gifted
- Occasion (meeting, conference, etc.)
- Notes for additional context
- Search and filter capabilities

### 3. **Consignment Shop Management**
Manage books placed at souvenir shops for sale:
- Shop details (name, location, contact info)
- Books placed, sold, and remaining
- Revenue tracking with payment history
- **Record Sale**: When shop informs of a sale
- **Restock**: Add more books when shop requests
- Automatic calculation of remaining inventory
- Total revenue per shop

### 4. **Manual Order Creation**
Add orders from non-website sources:
- Social media orders (Instagram, Facebook, etc.)
- Physical/in-person purchases
- Friend and family orders
- Custom tracking number generation (MANUAL-timestamp)
- Full order details with status selection

### 5. **Enhanced Book Count Tracking**
- Each section shows total book count, not just number of records
- Orders display total books ordered across all orders
- Accurate inventory tracking across all channels

## 📦 Setup Instructions

### Step 1: Run Database Migration

1. Open your Supabase Dashboard
2. Go to the SQL Editor
3. Open the file `inventory_migration.sql` in this project
4. Copy and paste the entire SQL script
5. Run the script to create the new tables:
   - `gifts`
   - `consignment_shops`

The migration includes:
- Table creation with proper constraints
- Row Level Security policies
- Indexes for better performance
- Automatic triggers for calculating remaining books

### Step 2: Verify Tables Created

Run this query in Supabase SQL Editor to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('gifts', 'consignment_shops');
```

You should see both tables listed.

### Step 3: Test the Features

1. **Login** to your CMS
2. Navigate to the **Inventory** tab (now the default landing page)
3. Test each feature:
   - View the dashboard stats
   - **Orders**: Click "Add Manual Order" to create a manual order
   - **Gifts**: Click "Record Gift" to add a gift record
   - **Consignment**: Click "Add Shop" to add a consignment shop

## 🚀 How to Use

### Recording Gifts

1. Go to **Gifts** tab
2. Click **Record Gift**
3. Fill in:
   - Recipient name *
   - Title/position (e.g., "CEO", "Minister")
   - Organization
   - Number of books *
   - Date gifted *
   - Occasion (optional)
   - Notes (optional)
4. Click **Record Gift**

### Managing Consignment Shops

**Adding a Shop:**
1. Go to **Consignment** tab
2. Click **Add Shop**
3. Fill in shop details
4. Set initial books placed
5. Click **Add Shop**

**Recording a Sale:**
1. Click the 💰 (dollar) icon next to the shop
2. Enter number of books sold
3. Enter revenue received
4. Click **Record Sale**
   - This automatically updates books remaining and total revenue
   - Records the payment date

**Restocking a Shop:**
1. Click the 📦 (package) icon next to the shop
2. Enter number of additional books
3. Click **Restock**
   - This adds to books placed and updates remaining inventory

### Adding Manual Orders

1. Go to **Orders** tab
2. Click **Add Manual Order**
3. Fill in customer details:
   - Name and email (required)
   - Phone (optional)
   - Number of books *
   - Shipping address (leave blank for event pickup)
   - Order status *
   - Event attendance checkbox
4. Click **Create Order**
   - Tracking number is auto-generated as `MANUAL-{timestamp}`

## 📊 Dashboard Statistics Explained

- **Total Books Distributed**: Sum of all books sold, gifted, and in consignment
- **Books Sold**: Total books from customer orders (website + manual)
- **Books Gifted**: Total books given as gifts
- **Books in Consignment**: Current inventory at all shops (remaining)
- **Consignment Revenue**: Total money received from all shops
- **Breakdown Percentages**: Visual representation of distribution channels

## 🔄 Data Flow

1. **Website Orders** → Automatically tracked in Orders table
2. **Manual Orders** → Added via "Add Manual Order" button
3. **Gifts** → Recorded in Gifts table
4. **Consignment** → Tracked in Consignment Shops table
5. **Inventory Dashboard** → Calculates totals from all sources

## ⚠️ Important Notes

- **No Breaking Changes**: All existing functionality remains intact
- **Website Compatibility**: Your website frontend continues to work normally
- **Database Safety**: New tables are separate from existing ones
- **Automatic Calculations**: Books remaining in consignment shops are calculated automatically
- **Manual Order Tracking Numbers**: Start with "MANUAL-" for easy identification

## 🛡️ Security

- Row Level Security (RLS) enabled on all new tables
- Policies allow authenticated users full access
- Modify policies in Supabase if you need role-based restrictions

## 🐛 Troubleshooting

**Issue**: Tables not appearing
- **Solution**: Ensure you ran the migration script in Supabase SQL Editor

**Issue**: Permission errors
- **Solution**: Check RLS policies in Supabase Dashboard → Authentication → Policies

**Issue**: Stats not updating
- **Solution**: Stats update automatically when you add/modify records. Refresh the Inventory Dashboard tab.

**Issue**: Can't record sale (not enough books)
- **Solution**: The system prevents recording more sales than available books. Check books_remaining.

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all tables exist in Supabase
3. Ensure RLS policies are properly set up
4. Check that your Supabase connection is working

## 🎉 Success!

You now have a complete inventory management system that tracks:
- ✅ Website orders
- ✅ Manual orders (social media, physical sales)
- ✅ Books gifted to VIPs and partners
- ✅ Consignment shop inventory and sales
- ✅ Complete distribution statistics

All without breaking your existing website functionality!
