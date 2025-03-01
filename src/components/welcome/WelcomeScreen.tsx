
import React from "react";
import { Button } from "@/components/ui/button";
import { usePopup } from "@/contexts/PopupContext";
import { PlusCircle } from "lucide-react";

const WelcomeScreen: React.FC = () => {
  const { createTemplate } = usePopup();

  return (
    <div className="flex items-center justify-center h-full bg-muted/30">
      <div className="max-w-md mx-auto p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Popup Builder</h1>
        <p className="text-muted-foreground">
          Create beautiful, customizable popups for your website with our easy-to-use builder.
        </p>
        <Button size="lg" onClick={createTemplate} className="mx-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Template
        </Button>
        <div className="mt-12 grid gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Getting Started</p>
            <p>1. Create a template</p>
            <p>2. Add elements from the library</p>
            <p>3. Customize layout and styles</p>
            <p>4. Export your code</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
