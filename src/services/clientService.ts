
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProspectProfile, ProspectWithEngagement } from './types/serviceTypes';
import { createProspect, getProspectById } from './prospectService';

/**
 * Creates a new client and handles any errors
 */
export const createNewClient = async (clientData: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
}): Promise<ProspectWithEngagement> => {
  try {
    const newClient = await createProspect({
      first_name: clientData.firstName,
      last_name: clientData.lastName,
      email: clientData.email,
      company: clientData.company || null,
      phone: clientData.phone || null
    });
    
    toast.success(`Client ${clientData.firstName} ${clientData.lastName} created successfully`);
    return newClient;
  } catch (error: any) {
    console.error('Error creating client:', error);
    
    // Show more specific error message based on the error
    if (error.message.includes('row-level security policy')) {
      toast.error('Permission denied: You do not have permission to create clients');
    } else {
      toast.error(`Error creating client: ${error.message}`);
    }
    
    throw error;
  }
};

/**
 * Gets a client by ID with better error handling
 */
export const getClientById = async (id: string): Promise<ProspectWithEngagement | null> => {
  try {
    return await getProspectById(id);
  } catch (error: any) {
    console.error('Error fetching client:', error);
    toast.error(`Error fetching client: ${error.message}`);
    return null;
  }
};
