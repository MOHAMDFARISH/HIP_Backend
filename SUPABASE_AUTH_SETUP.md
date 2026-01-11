# Supabase Authentication Setup Guide

This guide will walk you through setting up proper Supabase authentication for your Book Pre-Order Management System.

## What Changed?

Your application now uses **proper Supabase Authentication** instead of simple client-side login. This provides:

✅ **Real server-side authentication**
✅ **Secure session management**
✅ **Row Level Security (RLS) policies**
✅ **Protection against unauthorized access**
✅ **Audit trails for database operations**

## Setup Steps

### Step 1: Enable Email Authentication in Supabase

1. Go to your **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Make sure **Email** provider is **enabled**
5. Under **Auth Settings**, configure:
   - **Site URL**: Your application URL (e.g., `http://localhost:5173` for development)
   - **Redirect URLs**: Add your application URL
   - **Email Templates**: Customize if needed (optional)

### Step 2: Create Your Admin User

You need to create an admin user account in Supabase:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter your admin email and password:
   - **Email**: `your-admin-email@example.com`
   - **Password**: Choose a strong password (min 6 characters)
   - **Auto Confirm User**: ✅ Check this box (important!)
4. Click **Create user**

#### Option B: Using SQL

Run this in your Supabase SQL Editor:

```sql
-- This will be handled automatically by Supabase Auth
-- Just use the dashboard method above instead
```

### Step 3: Enable Row Level Security (RLS)

1. Open **Supabase SQL Editor**
2. Copy the entire contents of `enable_rls_policies.sql`
3. Paste into a **New Query**
4. Click **Run** to execute

This script will:
- Enable RLS on all your tables
- Create policies allowing authenticated users full access
- Protect your data from unauthorized access

### Step 4: Test Your Authentication

1. Make sure your frontend is running:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to your application
3. You should see the login page
4. Enter the email and password you created in Step 2
5. Click **Sign in**

**Expected Behavior:**
- ✅ If credentials are correct: You'll be logged in and see the dashboard
- ❌ If credentials are wrong: You'll see an error message

### Step 5: Verify Everything Works

After logging in, test these features:

- [ ] View orders
- [ ] Create a new order
- [ ] Update an order
- [ ] Delete an order
- [ ] View and edit blog posts
- [ ] Update media items
- [ ] Record consignment sales
- [ ] Update reviews

All of these should now work properly!

## Security Features Enabled

### 1. Row Level Security (RLS)
All database tables are now protected with RLS policies that require authentication:

- **orders**
- **blog_posts**
- **media_items**
- **reviews**
- **gifts**
- **consignment_shops**
- **inventory_stock**

### 2. Session Management
- Sessions are stored securely by Supabase
- Sessions expire automatically (default: 1 hour)
- Refresh tokens keep you logged in (default: 30 days)
- Logout properly clears all sessions

### 3. Database Protection
- No direct database access without authentication
- All operations require valid Supabase session
- API keys alone cannot modify data

## Troubleshooting

### Problem: "Invalid login credentials" error

**Solution:**
- Make sure you created the user with **Auto Confirm User** checked
- Verify the email and password are correct
- Check that Email authentication is enabled in Supabase

### Problem: "User already registered" when creating user

**Solution:**
- This means the user already exists
- Go to **Authentication** → **Users** to view existing users
- You can use the existing user or delete and recreate

### Problem: Can't view/update data after login

**Solution:**
- Make sure you ran the `enable_rls_policies.sql` script completely
- Verify RLS is enabled:
  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public';
  ```
- All tables should show `rowsecurity = true`

### Problem: Application shows loading spinner forever

**Solution:**
- Check browser console (F12) for errors
- Make sure your Supabase URL and keys are correct in `.env`
- Verify your internet connection

## Environment Variables

Your application needs these environment variables (should already be set):

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Note:** You can now remove these old variables:
- ~~VITE_ADMIN_USER~~ (no longer needed)
- ~~VITE_ADMIN_PASS~~ (no longer needed)

## Adding More Admin Users

To add additional admin users:

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Check **Auto Confirm User**
5. Click **Create user**

That's it! The new user can now log in immediately.

## Session Configuration (Optional)

To customize session duration:

1. Go to **Authentication** → **Configuration**
2. Adjust these settings:
   - **JWT expiry**: How long before needing to refresh (default: 3600s = 1 hour)
   - **Refresh token expiry**: How long user stays logged in (default: 2592000s = 30 days)

## Security Best Practices

### ✅ DO:
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Enable two-factor authentication in Supabase (if available)
- Monitor auth logs regularly
- Review user list periodically
- Keep Supabase SDK updated

### ❌ DON'T:
- Share admin credentials
- Use simple passwords like "password123"
- Disable RLS policies
- Share your Supabase service role key
- Store passwords in code or commits

## What Happens Behind the Scenes

### When you log in:
1. Frontend sends email/password to Supabase Auth
2. Supabase verifies credentials
3. Supabase returns a JWT (JSON Web Token) session
4. Frontend stores session securely
5. All database requests include this JWT
6. RLS policies check JWT before allowing access

### When you make database changes:
1. Frontend sends request to Supabase with JWT
2. Supabase validates JWT is authentic and not expired
3. RLS policies check if authenticated user has permission
4. If permitted, operation succeeds
5. If not, operation is blocked

This is **real authentication**, not just a client-side check!

## Next Steps

Now that authentication is properly set up:

1. ✅ Your data is secure
2. ✅ Only authenticated users can access the admin panel
3. ✅ All database operations are protected
4. ✅ You have proper audit trails

You can now safely deploy your application to production!

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase Auth logs: **Authentication** → **Logs**
3. Check browser console for errors (F12)
4. Review the Supabase documentation: https://supabase.com/docs/guides/auth

---

**Last Updated:** January 2026
**Application:** Book Pre-Order Management System
**Authentication Provider:** Supabase Auth
