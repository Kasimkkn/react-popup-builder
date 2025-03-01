
import React, { useState, useEffect } from "react";
import { CheckIcon } from "lucide-react";

interface CodeCopiedNotificationProps {
  show: boolean;
  onHide: () => void;
}

const CodeCopiedNotification: React.FC<CodeCopiedNotificationProps> = ({ 
  show, 
  onHide 
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);
  
  if (!show) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-lg animate-fade-in flex items-center">
      <CheckIcon className="h-4 w-4 mr-2" />
      <span>Code copied to clipboard!</span>
    </div>
  );
};

export default CodeCopiedNotification;
