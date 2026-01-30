# 🚨 ACTION REQUIRED: Fix RLS Policies in Supabase

## ⚠️ CRITICAL: SQL Scripts Must Be Run in Supabase

**IMPORTANT:** The SQL files in this project are just code files. They **DO NOT automatically apply** to your database. You **MUST run them in Supabase SQL Editor** for them to take effect.

---

## 🎯 Quick Fix (Fix Current Issue)

You're getting RLS errors on **media_items** right now. Here's the immediate fix:

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on **"SQL Editor"** in the left sidebar

3. **Run the Emergency Fix**
   - Open the file `emergency_fix_media_items_rls.sql` from your project
   - Copy **ALL** the contents (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)

4. **Verify Success**
   - You should see output showing:
     - ✓ Your auth status
     - ✓ Policies being dropped
     - ✓ New policies being created
     - ✓ "MEDIA_ITEMS RLS FIXED!" message

5. **Restart Your Dev Server**
   ```bash
   # Stop your dev server (Ctrl+C)
   npm run dev
   ```

6. **Clear Browser Cache & Re-login**
   - Press Ctrl+Shift+Delete
   - Clear cache
   - Log out of admin panel
   - Log back in

7. **Test**
   - Try unpublishing a media item
   - It should work now! ✅

---

## 🔒 Complete Fix (Prevent Future Issues)

After fixing media_items, **run the comprehensive fix** to fix ALL tables at once:

### Step-by-Step Instructions:

1. **Open Supabase SQL Editor** (same as above)

2. **Run the Complete Fix**
   - Open the file `fix_all_rls_policies.sql` from your project
   - Copy **ALL** the contents
   - Paste into Supabase SQL Editor
   - Click **"Run"**

3. **This Will Fix RLS for ALL Tables:**
   - ✅ orders
   - ✅ blog_posts
   - ✅ media_items
   - ✅ reviews
   - ✅ gifts
   - ✅ consignment_shops
   - ✅ inventory_stock

4. **Verify Success**
   - You should see a table showing policy counts for each table
   - Example:
     ```
     orders: 4 policies
     blog_posts: 5 policies
     media_items: 5 policies
     reviews: 5 policies
     gifts: 4 policies
     consignment_shops: 4 policies
     inventory_stock: 4 policies
     ```

5. **Done!**
   - All admin operations will now work across all tables
   - No more RLS errors! 🎉

---

## 📋 Checklist

Track your progress:

### Immediate Fix (media_items):
- [ ] Opened Supabase Dashboard
- [ ] Opened SQL Editor
- [ ] Copied `emergency_fix_media_items_rls.sql`
- [ ] Pasted and ran in SQL Editor
- [ ] Saw success message
- [ ] Restarted dev server
- [ ] Cleared cache & re-logged in
- [ ] Tested unpublishing media item - IT WORKS! ✅

### Complete Fix (all tables):
- [ ] Opened Supabase SQL Editor
- [ ] Copied `fix_all_rls_policies.sql`
- [ ] Pasted and ran in SQL Editor
- [ ] Verified all 7 tables have correct policies
- [ ] All CRUD operations work on all tables! ✅

---

## 🤔 Why Do I Need to Do This?

**The Problem:**
- SQL scripts are just text files in your project
- They contain instructions for the database
- But they don't run automatically

**The Solution:**
- You must copy and run them in Supabase SQL Editor
- This applies the policies to your actual database
- Once applied, they stay applied forever

**Analogy:**
- Having a recipe (SQL file) ≠ Having a cooked meal (working database)
- You need to cook the recipe (run the SQL) to get the meal (working RLS)

---

## 🐛 Debugging

If you still get RLS errors after running the SQL:

### Check Auth Status in Console

Open browser console (F12) and look for:
```
Updating media item - Auth status: {
  isAuthenticated: true,  ← Should be true
  userId: "uuid-here",    ← Should have a UUID
  role: "authenticated"   ← Should be "authenticated"
}
```

**If isAuthenticated is false:**
- Your session expired
- Log out and log back in
- Make sure you're logged into the admin panel

**If you see an error message:**
- Read the error carefully
- It will tell you what's wrong
- Share it for more help

### Check Policies in Supabase

In Supabase SQL Editor, run:
```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'blog_posts', 'media_items', 'reviews', 'gifts', 'consignment_shops', 'inventory_stock')
GROUP BY tablename;
```

**Expected:**
- Each table should have 4-5 policies
- If 0 policies → You didn't run the SQL script yet
- If different numbers → Run fix_all_rls_policies.sql again

---

## 📚 Available SQL Scripts

### Emergency Fixes (Quick fixes for specific tables):
1. **`emergency_fix_reviews_rls.sql`** - Fix reviews table
2. **`emergency_fix_media_items_rls.sql`** - Fix media_items table

### Comprehensive Fixes (Fix everything):
1. **`fix_all_rls_policies.sql`** ⭐ **BEST** - Fix all 7 tables at once
2. **`fix_authenticated_rls.sql`** - Original fix for blog_posts
3. **`diagnose_and_fix_rls.sql`** - Diagnostic version

### Which Should I Run?

**Recommended order:**

1. **If you have an immediate issue:**
   - Run the emergency fix for that specific table first
   - Then run `fix_all_rls_policies.sql` to prevent future issues

2. **If you want to prevent all issues:**
   - Just run `fix_all_rls_policies.sql` once
   - Fixes everything at once
   - No more RLS errors on any table!

---

## ✅ Success Indicators

You'll know everything is working when:

1. **No RLS errors** when creating/updating/deleting any records
2. **Console logs show** `isAuthenticated: true`
3. **All admin operations work** across all tables
4. **Unpublishing works** for blog posts, media items, reviews

---

## 🆘 Still Having Issues?

If you've:
- ✅ Run the SQL script in Supabase SQL Editor
- ✅ Restarted your dev server
- ✅ Cleared cache and re-logged in
- ❌ Still getting RLS errors

Then:
1. Check the browser console for detailed error messages
2. Check if `isAuthenticated: true` in the logs
3. Verify policies exist in Supabase (use the query above)
4. Share the exact error message for more help

---

## 🎯 Bottom Line

**You MUST run the SQL scripts in Supabase SQL Editor. They won't work automatically.**

1. Copy `emergency_fix_media_items_rls.sql` → Run in Supabase SQL Editor → Fix media_items
2. Copy `fix_all_rls_policies.sql` → Run in Supabase SQL Editor → Fix all tables
3. Restart dev server → Clear cache → Re-login → Everything works! ✅
