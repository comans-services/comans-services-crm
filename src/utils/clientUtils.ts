
/**
 * Get status color based on days since last contact
 */
export const getStatusColor = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'gray-400';
  }
  if (daysSinceLastContact <= 2) {
    return 'green-500';
  }
  if (daysSinceLastContact <= 5) {
    return 'yellow-500';
  }
  if (daysSinceLastContact <= 10) {
    return 'orange-500';
  }
  return 'red-500';
};

/**
 * Get recommended action based on days since last contact
 */
export const getRecommendedAction = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'Initial contact needed';
  }
  if (daysSinceLastContact <= 2) {
    return 'Follow up next week';
  }
  if (daysSinceLastContact <= 5) {
    return 'Follow up this week';
  }
  if (daysSinceLastContact <= 10) {
    return 'Follow up today';
  }
  return 'Urgent follow up required';
};
