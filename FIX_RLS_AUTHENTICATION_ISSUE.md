# Fix RLS Authentication Issue for Blog Posts

## Problem Diagnosis

You're getting "violates row-level security policy for table 'blog_posts'" because:

1. **Your Supabase client uses the ANON key** (`src/services/supabase.ts`)
2. **No authentication is implemented** (no login mechanism exists)
3. **Your RLS policies require "authenticated" role** to insert/update/delete
4. **Result**: All operations are made as "anon" user, which is blocked by RLS

## Current State

```typescript
// src/services/supabase.ts
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Current RLS Policies:**
- ❌ INSERT: Requires `authenticated` role
- ❌ UPDATE: Requires `authenticated` role
- ❌ DELETE: Requires `authenticated` role
- ✅ SELECT: Allows `anon` to view published posts

## Solutions

### 🎯 SOLUTION 1: Use Service Role Key (Recommended for Admin Tools)

If this is an **internal admin tool** that only you/your team use, bypass RLS by using the service role key.

**Steps:**

1. Add service role key to your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Add this
```

2. Update `src/services/supabase.ts`:
```typescript
/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are required.');
}

// Using service role key bypasses RLS for admin operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

⚠️ **Security Warning**: Service role key bypasses ALL RLS policies. Only use this for:
- Internal admin tools
- Server-side operations
- Trusted environments
- NEVER expose service role key to public websites

---

### 🎯 SOLUTION 2: Implement Proper Authentication (Recommended for User-Facing Apps)

If this is a **user-facing admin panel**, implement proper authentication.

**Steps:**

1. Create authentication service (`src/services/auth.ts`):
```typescript
import { supabase } from './supabase';

export const authService = {
  // Sign in with email/password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }
};
```

2. Create login component (`src/components/Login.tsx`):
```typescript
import React, { useState } from 'react';
import { authService } from '../services/auth';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await authService.signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      onLogin();
    }
  };

  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
```

3. Protect your admin routes (update your App component).

4. Create admin user in Supabase Dashboard:
   - Go to Authentication → Users
   - Click "Add user"
   - Create admin account

---

### 🎯 SOLUTION 3: Update RLS Policies to Allow Anon (NOT RECOMMENDED)

⚠️ **SECURITY RISK**: This allows anyone to create/edit/delete blog posts without authentication.

Only use this for development/testing.

```sql
-- Allow anonymous users to manage blog posts (INSECURE!)
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

CREATE POLICY "Anyone can insert blog posts" ON public.blog_posts
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update blog posts" ON public.blog_posts
FOR UPDATE TO anon, authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete blog posts" ON public.blog_posts
FOR DELETE TO anon, authenticated
USING (true);
```

---

## Quick Test to Verify Your Current Authentication Status

Run this in Supabase SQL Editor:

```sql
-- Check what role your current connection is using
SELECT current_user, current_role;

-- Check if you have auth schema access
SELECT auth.role();  -- Should return 'anon' or 'authenticated'
SELECT auth.uid();   -- Should return UUID if authenticated, NULL if anon
```

If `auth.uid()` returns `NULL`, you're not authenticated.

---

## Recommended Approach

For your use case, I recommend **SOLUTION 1** (Service Role Key) because:

1. ✅ This appears to be an admin management interface
2. ✅ Quick fix with minimal code changes
3. ✅ No need to implement full authentication system
4. ✅ Still maintains RLS for public-facing API endpoints

Just make sure to:
- Keep service role key in `.env` (never commit to git)
- Only use in trusted environments
- Add `.env` to `.gitignore`

---

## Next Steps

1. Choose one of the solutions above
2. Run the SQL diagnostic script: `diagnose_and_fix_rls.sql`
3. Test insert/update/delete operations
4. Verify RLS policies are working correctly
