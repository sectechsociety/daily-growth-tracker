# Enhanced Supabase Setup Guide for Leaderboard

## 🚀 Quick Setup

1. **Copy your `.env` file** and add these variables:
   ```env
   # Supabase Configuration (Required for Leaderboard)
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Get your Supabase credentials:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API
   - Copy the Project URL and anon/public key

3. **Run the SQL schema:**
   ```sql
   -- Execute this in Supabase SQL Editor
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
   CREATE INDEX IF NOT EXISTS idx_leaderboard_last_updated ON public.leaderboard (last_updated DESC);

   -- Enable Row Level Security (RLS)
   ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

   -- Create policies for RLS
   CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
       FOR SELECT USING (true);

   CREATE POLICY "Users can insert their own leaderboard entry" ON public.leaderboard
       FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own leaderboard entry" ON public.leaderboard
       FOR UPDATE USING (auth.uid() = user_id);

   -- Create trigger to automatically update last_updated
   CREATE OR REPLACE FUNCTION update_last_updated()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.last_updated = NOW();
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER trigger_update_last_updated
       BEFORE UPDATE ON public.leaderboard
       FOR EACH ROW
       EXECUTE FUNCTION update_last_updated();
   ```

## 🛠️ Troubleshooting

### Common Issues:

1. **"Failed to load resource" errors:**
   - Backend server not running on port 5000
   - Check if your backend is started: `cd my-backend && npm start`

2. **Authentication errors:**
   - Wrong Supabase credentials in `.env`
   - Check your Supabase project settings

3. **Empty leaderboard:**
   - Supabase table not created
   - Run the SQL schema in Supabase dashboard

4. **Data not persisting:**
   - Environment variables not set correctly
   - Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

### Testing:

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Complete tasks → Should gain XP
   - Check leaderboard → Should show updated rankings
   - Refresh page → Data should persist

3. **Verify real-time updates:**
   - Open leaderboard in multiple tabs
   - Complete tasks in one tab
   - Other tabs should update automatically

## 🎯 Features Added:

✅ **Enhanced Supabase Client** - Better configuration and error handling
✅ **Retry Mechanisms** - Automatic retry for failed requests
✅ **Real-time Subscriptions** - Live updates across all users
✅ **Error Boundaries** - Graceful error handling with retry options
✅ **Better Loading States** - Improved user experience
✅ **Automatic User Registration** - Users added to leaderboard on first use
✅ **Data Persistence** - All progress stored in Supabase
✅ **Row Level Security** - Proper access control

## 🚨 Important Notes:

- The leaderboard requires both Supabase AND your backend server to be running
- Make sure your `.env` file contains the correct Supabase credentials
- The SQL schema must be run in your Supabase dashboard before the leaderboard will work
- Real-time updates require proper Supabase configuration

Once everything is set up correctly, the leaderboard will work perfectly with real-time updates! 🎉
