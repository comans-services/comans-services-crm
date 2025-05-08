
import { v4 as uuidv4 } from 'uuid';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
}

// Mock function to simulate AI extracting action items from documents
export const extractActionItemsFromDocument = (fileName: string): Promise<ActionItem[]> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Generate 2-4 random action items
      const numberOfItems = Math.floor(Math.random() * 3) + 2;
      const actionItems: ActionItem[] = [];
      
      const priorities = ['low', 'medium', 'high'] as const;
      const statuses = ['todo', 'in-progress', 'completed'] as const;
      
      // Sample action item titles based on document type
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      const actionTitles = {
        pdf: [
          'Review product specifications',
          'Schedule follow-up call',
          'Prepare proposal',
          'Send case studies',
          'Discuss budget constraints'
        ],
        docx: [
          'Update contract terms',
          'Finalize pricing structure',
          'Address legal concerns',
          'Share testimonials',
          'Present ROI analysis'
        ],
        xlsx: [
          'Analyze financial projections',
          'Compare pricing options',
          'Review purchase history',
          'Update forecast model',
          'Discuss volume discounts'
        ],
        default: [
          'Schedule next meeting',
          'Send additional information',
          'Follow up on questions',
          'Prepare presentation',
          'Request stakeholder meeting'
        ]
      };
      
      const titles = actionTitles[fileExtension as keyof typeof actionTitles] || actionTitles.default;
      
      // Generate random action items
      for (let i = 0; i < numberOfItems; i++) {
        const randomTitleIndex = Math.floor(Math.random() * titles.length);
        const daysToAdd = Math.floor(Math.random() * 14) + 1;
        const today = new Date();
        const dueDate = new Date(today.setDate(today.getDate() + daysToAdd));
        
        actionItems.push({
          id: uuidv4(),
          title: titles[randomTitleIndex],
          description: `AI extracted task from ${fileName}. This is a simulated action item that would be created by analyzing the content of the uploaded document.`,
          dueDate: dueDate.toISOString(),
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          status: 'todo',
          createdAt: new Date().toISOString()
        });
        
        // Remove used title to avoid duplicates
        titles.splice(randomTitleIndex, 1);
      }
      
      resolve(actionItems);
    }, 1500); // 1.5 second delay to simulate processing
  });
};
