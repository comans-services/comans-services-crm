
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  dueDate: string;
  completed?: boolean;
}

export const extractActionItems = async (documentText: string): Promise<ActionItem[]> => {
  // This is a mock implementation
  return [
    {
      id: '1',
      title: 'Schedule follow-up meeting',
      description: 'Book a follow-up discussion to present proposal details',
      priority: 'high',
      createdAt: '2023-04-15T09:00:00Z',
      dueDate: '2023-04-22T09:00:00Z',
    },
    {
      id: '2',
      title: 'Send pricing information',
      description: 'Email updated pricing sheet for enterprise plan',
      priority: 'medium',
      createdAt: '2023-04-15T09:00:00Z',
      dueDate: '2023-04-20T09:00:00Z',
    }
  ];
};

export const generateClientSummary = async (clientData: any): Promise<string> => {
  return `This client has been with us since ${new Date(clientData.client_since || Date.now()).toLocaleDateString()}. They have shown interest in our premium offerings and have engaged with our sales team ${clientData.communications?.length || 0} times.`;
};
