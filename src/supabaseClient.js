import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Enhanced Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'daily-growth-tracker',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Utility functions for better error handling and data management
export const supabaseUtils = {
  // Enhanced error handler
  handleError: (error, operation = 'operation') => {
    console.error(`Supabase ${operation} error:`, error);

    // Provide user-friendly error messages
    if (error?.code === 'PGRST116') {
      return `No data found for ${operation}`;
    }
    if (error?.message?.includes('JWT')) {
      return 'Authentication expired. Please refresh the page.';
    }
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return 'Network error. Please check your connection and Supabase configuration.';
    }
    if (error?.code === '42P01') {
      return 'Database table not found. Please run the SQL schema in Supabase.';
    }

    return error?.message || `Failed to ${operation}`;
  },

  // Retry mechanism for failed requests
  retry: async (fn, maxRetries = 3, delay = 1000) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    throw lastError;
  },

  // Safe data accessor with fallbacks
  safeGet: (obj, path, fallback = null) => {
    try {
      return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
    } catch {
      return fallback;
    }
  },

  // Validate required environment variables
  validateConfig: () => {
    const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !import.meta.env[key] || import.meta.env[key] === 'placeholder-key');

    if (missing.length > 0) {
      console.error('❌ Missing or invalid Supabase environment variables:', missing);
      console.error('Please add these to your .env file:');
      console.error('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
      console.error('VITE_SUPABASE_ANON_KEY=your-anon-key-here');
      return false;
    }

    console.log('✅ Supabase configuration validated');
    return true;
  }
};

// Initialize and validate configuration
if (typeof window !== 'undefined') {
  supabaseUtils.validateConfig();
}
