
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Upload, FileText } from 'lucide-react';
import { extractActionItemsFromDocument, ActionItem } from '@/services/mockAiService';
import { format } from 'date-fns';

interface DocumentUploaderProps {
  clientId: string;
  clientName: string;
  onActionItemsExtracted: (items: ActionItem[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ clientId, clientName, onActionItemsExtracted }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    const fileType = selectedFile.type;
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(fileType)) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF, Word or Excel file",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      
      toast({
        title: "File uploaded successfully",
        description: `Now extracting action items from ${selectedFile.name}`,
      });
      
      // Simulate AI processing
      extractActionItemsFromDocument(selectedFile.name)
        .then(actionItems => {
          // Pass the extracted action items to the parent component
          onActionItemsExtracted(actionItems);
          
          toast({
            title: "AI Processing Complete",
            description: `${actionItems.length} action items extracted successfully`,
          });
          
          // Reset the file input
          setSelectedFile(null);
          setIsProcessing(false);
        })
        .catch(error => {
          toast({
            title: "AI Processing Error",
            description: "Failed to extract action items. Please try again.",
            variant: "destructive",
          });
          console.error("AI Processing Error:", error);
          setIsProcessing(false);
        });
    }, 1500);
  };
  
  return (
    <div className="mb-6 border border-white/10 rounded-md p-5">
      <h3 className="text-lg font-medium mb-4">Upload Sales Plan Document</h3>
      <p className="text-sm text-white/70 mb-4">
        Upload a document (PDF, Word, Excel) to automatically extract action items for {clientName}.
        Our AI will analyze the document and create tasks based on the content.
      </p>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="border border-dashed border-white/30 rounded-md p-4 flex flex-col items-center justify-center bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <input 
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.xlsx,.doc,.xls"
              disabled={isUploading || isProcessing}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
              <Upload size={32} className="text-white/70 mb-2" />
              <p className="text-sm font-medium">
                {selectedFile ? selectedFile.name : "Click to select file"}
              </p>
              {selectedFile && (
                <p className="text-xs text-white/50 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </label>
          </div>
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading || isProcessing}
          className="min-w-[120px]"
        >
          {isUploading ? "Uploading..." : isProcessing ? "Processing..." : "Upload & Process"}
        </Button>
      </div>
      
      <div className="mt-3 text-xs text-white/50">
        Supported formats: PDF, Word, Excel (Max 5MB)
      </div>
    </div>
  );
};

export default DocumentUploader;
