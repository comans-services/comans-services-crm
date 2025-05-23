
// This file is kept for backward compatibility but with disconnected functionality
// It provides mock implementations that don't connect to Supabase

// Export types without implementation
export type ProspectProfile = any;
export type ProspectEngagement = any;
export type SalesTracking = any;
export type TeamMember = any;
export type UserActivity = any;
export type ActionItem = any;
export type ProspectWithEngagement = any;

// Export prospect service functions with mock implementations
export const getProspects = async () => [];
export const getProspectById = async () => null;
export const getProspectsByCompany = async () => ({});
export const createProspect = async () => ({});

// Export team service functions with mock implementations
export const getTeamMembers = async () => [];
export const addTeamMember = async () => ({});
export const updateTeamMember = async () => ({});
export const removeTeamMember = async () => {};

// Export activity service functions with mock implementations
export const getUserActivity = async () => [];
export const recordUserActivity = async () => ({});
export const extractActionItemsFromDocument = async () => [];

// Export base service functions with mock implementations
export const setupRealTimeSubscription = () => (() => {});

// Re-export auth services from authService
export { signUp, signIn, signOut, getCurrentSession, cleanupAuthState } from './authService';
export { recordCommunication } from './communicationService';

// Fix missing method errors by providing mock implementations
export const from = (table: string) => ({
  select: () => ({ data: [], error: null }),
  insert: () => ({ data: [], error: null }),
  update: () => ({ data: [], error: null }),
  delete: () => ({ data: [], error: null }),
  eq: () => ({ data: [], error: null }),
  in: () => ({ data: [], error: null }),
  order: () => ({ data: [], error: null })
});
