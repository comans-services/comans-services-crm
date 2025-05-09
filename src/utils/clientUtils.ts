import { format } from 'date-fns';
import { ProspectWithEngagement } from '@/services/supabaseService';

export const formatProspectData = (prospects: ProspectWithEngagement[]) => {
  return prospects.map(prospect => {
    const daysSinceLastContact = calculateDaysSinceLastContact(prospect.engagement.last_contact_date);
    const statusColor = getStatusColor(daysSinceLastContact);
    const recommendedAction = getRecommendedAction(daysSinceLastContact);

    return {
      ...prospect,
      daysSinceLastContact,
      statusColor,
      recommendedAction,
    };
  });
};

export const calculateDaysSinceLastContact = (lastContactDate: string | null): number | null => {
  if (!lastContactDate) {
    return null;
  }

  const lastContact = new Date(lastContactDate);
  const today = new Date();
  const differenceInTime = today.getTime() - lastContact.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
};

export const getStatusColor = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'gray';
  } else if (daysSinceLastContact <= 7) {
    return 'green';
  } else if (daysSinceLastContact <= 30) {
    return 'yellow';
  } else {
    return 'red';
  }
};

export const getRecommendedAction = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'Schedule initial contact';
  } else if (daysSinceLastContact <= 7) {
    return 'Maintain regular contact';
  } else if (daysSinceLastContact <= 30) {
    return 'Re-engage the client';
  } else {
    return 'Assess and revive the relationship';
  }
};
