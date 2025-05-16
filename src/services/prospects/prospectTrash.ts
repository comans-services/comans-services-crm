
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Move a client to the trash bin instead of permanently deleting
 * This is achieved by setting the is_deleted flag to true
 */
export const moveClientToTrash = async (clientId: string): Promise<void> => {
  try {
    // Update the prospect_profile table to mark the client as deleted
    const { error } = await supabase
      .from('prospect_profile')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', clientId);

    if (error) {
      console.error('Error moving client to trash:', error);
      throw new Error(error.message);
    }
  } catch (err: any) {
    console.error('Error moving client to trash:', err);
    throw new Error(err.message || 'Failed to move client to trash');
  }
};

/**
 * Restore a client from the trash bin
 */
export const restoreClientFromTrash = async (clientId: string): Promise<void> => {
  try {
    // Update the prospect_profile table to unmark the client as deleted
    const { error } = await supabase
      .from('prospect_profile')
      .update({
        is_deleted: false,
        deleted_at: null
      })
      .eq('id', clientId);

    if (error) {
      console.error('Error restoring client from trash:', error);
      throw new Error(error.message);
    }
  } catch (err: any) {
    console.error('Error restoring client from trash:', err);
    throw new Error(err.message || 'Failed to restore client from trash');
  }
};

/**
 * Get all clients that have been moved to the trash
 */
export const getTrashBinClients = async () => {
  try {
    const { data, error } = await supabase
      .from('prospect_profile')
      .select(`
        *,
        engagement:prospect_engagement(*)
      `)
      .eq('is_deleted', true)
      .order('deleted_at', { ascending: false });

    if (error) {
      console.error('Error fetching trash bin clients:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (err: any) {
    console.error('Error fetching trash bin clients:', err);
    throw new Error(err.message || 'Failed to fetch trash bin clients');
  }
};

/**
 * Permanently delete a client from the database
 */
export const permanentlyDeleteClient = async (clientId: string): Promise<void> => {
  try {
    // Delete the client record permanently
    const { error } = await supabase
      .from('prospect_profile')
      .delete()
      .eq('id', clientId);

    if (error) {
      console.error('Error permanently deleting client:', error);
      throw new Error(error.message);
    }
  } catch (err: any) {
    console.error('Error permanently deleting client:', err);
    throw new Error(err.message || 'Failed to permanently delete client');
  }
};
