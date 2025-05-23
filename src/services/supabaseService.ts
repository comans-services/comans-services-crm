
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

// Provide empty implementations for other exported functions
export const signUp = async () => ({ user: null, session: null, error: 'Supabase connection removed' });
export const signIn = async () => ({ user: null, session: null, error: 'Supabase connection removed' });
export const signOut = async () => {};
export const getCurrentSession = async () => ({ user: null, session: null });
export const cleanupAuthState = () => {};
export const recordCommunication = async () => ({});
