# 🚀 Quick Supabase Setup for Leaderboard

## 1. Get Your Supabase Credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: (long string starting with `eyJ`)

## 2. Add to Your `.env` File

Add these lines to your `.env` file in the project root:

```env
# Supabase Configuration (Required for Leaderboard)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste this SQL:
   ```sql
   -- Create leaderboard table
   CREATE TABLE IF NOT EXISTS public.leaderboard (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID NOT NULL,
       email TEXT NOT NULL,
       username TEXT,
       xp INTEGER DEFAULT 0,
       level INTEGER DEFAULT 1,
       last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

       CONSTRAINT unique_user_id UNIQUE (user_id)
   );

   -- Create indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON public.leaderboard (xp DESC);
   CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON public.leaderboard (level DESC);

   -- Enable Row Level Security (RLS)
   ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

   -- Create policies for RLS
   CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
       FOR SELECT USING (true);

   CREATE POLICY "Users can insert their own leaderboard entry" ON public.leaderboard
       FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own leaderboard entry" ON public.leaderboard
       FOR UPDATE USING (auth.uid() = user_id);
   ```

## 4. Test the Setup

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Check the browser console** for:
   - `✅ Supabase configuration validated` (good!)
   - `❌ Missing or invalid Supabase environment variables` (needs fixing)

3. **Test the leaderboard:**
   - Complete some tasks
   - Check if your rank updates in the leaderboard
   - Verify real-time updates work

## 🔧 Troubleshooting

### "Supabase configuration missing" Error:
- Make sure your `.env` file has the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check that the values are not placeholder text

### "Database table not found" Error:
- Make sure you ran the SQL schema in your Supabase dashboard
- Check that the table was created successfully

### Leaderboard shows demo data:
- This means Supabase isn't configured yet
- Follow the setup steps above
- The demo data will be replaced with real data once configured

### Data not updating:
- Check that your backend server is running (`npm start` in `my-backend`)
- Verify that the XP updates are being sent to Supabase

## ✅ What's Working Now:

- **Enhanced Error Handling**: Better error messages and retry mechanisms
- **Real-time Updates**: Live leaderboard updates when users gain XP
- **Fallback System**: Shows demo data when Supabase isn't configured
- **Better User Display**: Shows both username and email properly connected
- **Improved Loading States**: Better UX with retry options

Once you complete the setup above, the leaderboard will work perfectly with real-time updates! 🎉
