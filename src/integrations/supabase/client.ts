
// This file maintains the structure but removes actual Supabase connection
// It will be replaced when connecting to a new Supabase project
import type { Database } from './types';

// Create a placeholder client that doesn't connect to any Supabase instance
export const supabase = {
  auth: {
    signInWithPassword: () => ({ data: null, error: new Error('Supabase connection removed') }),
    signOut: () => ({ error: null }),
    getSession: () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: null, error: new Error('Supabase connection removed') }),
    insert: () => ({ data: null, error: new Error('Supabase connection removed') }),
    update: () => ({ data: null, error: new Error('Supabase connection removed') }),
    delete: () => ({ data: null, error: new Error('Supabase connection removed') })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error('Supabase connection removed') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  },
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {}
  }),
  removeChannel: () => {}
};
