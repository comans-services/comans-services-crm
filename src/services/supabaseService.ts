
// This file is kept for backward compatibility
// It re-exports everything from the modular services

// Export types
export type { 
  ProspectProfile,
  ProspectEngagement,
  SalesTracking,
  TeamMember,
  UserActivity,
  ActionItem,
  ProspectWithEngagement 
} from './types/serviceTypes';

// Export prospect service functions
export { 
  getProspects,
  getProspectById,
  getProspectsByCompany,
  createProspect
} from './prospectService';

// Export team service functions
export {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
} from './teamService';

// Export activity service functions
export {
  getUserActivity,
  recordUserActivity,
  extractActionItemsFromDocument
} from './activityService';

// Export communication service functions
export * from './communicationService';

// Export auth service functions
export * from './authService';

// Export base service functions
export { setupRealTimeSubscription } from './base/supabaseBase';
