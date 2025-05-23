
// This file maintains the structure but removes actual Supabase connection
// It will be replaced when connecting to a new Supabase project
import type { Database } from './types';

// Create a placeholder client that doesn't connect to any Supabase instance
export const supabase = {
  auth: {
    // Mock auth methods to avoid errors
    signInWithPassword: () => ({ data: null, error: new Error('Supabase connection removed') }),
    signOut: () => ({ error: null }),
    getSession: () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null }),
    eq: () => ({ data: [], error: null }),
    in: () => ({ data: [], error: null }),
    order: () => ({ data: [], error: null })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  },
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {}
  }),
  removeChannel: () => {}
};
