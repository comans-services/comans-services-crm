
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  completedAt?: string | null;
  prospectId?: string;
}

// Helper function to generate random action items based on document name
export const extractActionItemsFromDocument = async (documentName: string): Promise<ActionItem[]> => {
  // In a real implementation, this would use Supabase or another service to store/retrieve action items
  // For now, we'll generate some sample items based on the document name
  
  const now = new Date();
  const actionItems: ActionItem[] = [];
  
  // Generate 1-3 action items based on the document name
  const numItems = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numItems; i++) {
    const priorityOptions = ['high', 'medium', 'low'] as const;
    const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    
    const daysToAdd = Math.floor(Math.random() * 14) + 1;
    const dueDate = format(addDays(now, daysToAdd), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    
    actionItems.push({
      id: uuidv4(),
      title: generateActionTitle(documentName, i),
      description: generateActionDescription(documentName, i),
      priority,
      dueDate,
      createdAt: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      completedAt: null,
    });
  }
  
  return actionItems;
};

const generateActionTitle = (documentName: string, index: number): string => {
  const titles = [
    `Follow up on ${documentName.replace('.pdf', '').replace('.docx', '')}`,
    `Schedule meeting about ${documentName.replace('.pdf', '').replace('.docx', '')}`,
    `Send proposal based on ${documentName.replace('.pdf', '').replace('.docx', '')}`,
    `Prepare presentation for ${documentName.replace('.pdf', '').replace('.docx', '')}`,
    `Review details in ${documentName.replace('.pdf', '').replace('.docx', '')}`
  ];
  
  return titles[index % titles.length];
};

const generateActionDescription = (documentName: string, index: number): string => {
  const descriptions = [
    `Review the key points from ${documentName} and prepare a follow-up email to the client.`,
    `Document contains important information about client needs. Schedule a meeting to discuss next steps.`,
    `Based on the information in ${documentName}, create a proposal for the client with pricing options.`,
    `The client requirements in ${documentName} need to be addressed in our next presentation.`,
    `${documentName} contains feedback that needs to be incorporated into our strategy.`
  ];
  
  return descriptions[index % descriptions.length];
};
