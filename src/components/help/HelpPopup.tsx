
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const HelpPopup: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute bottom-4 right-4 h-10 w-10 rounded-full z-50">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>How to use Popup Builder</DialogTitle>
          <DialogDescription>
            Follow these simple steps to create and export your popup.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">1. Create a Template</h3>
            <p className="text-sm text-muted-foreground">
              Start by creating a new template or use an existing one from the dropdown menu.
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium">2. Add Elements</h3>
            <p className="text-sm text-muted-foreground">
              Go to the "Library" tab and add text, buttons, images, or input fields to your popup.
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium">3. Customize Your Popup</h3>
            <p className="text-sm text-muted-foreground">
              Use the "General" tab to set position, animation, and backdrop. Customize individual elements by selecting them and using the "Element" tab.
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium">4. Save and Export</h3>
            <p className="text-sm text-muted-foreground">
              Save your template regularly and export the code when finished. The code can be embedded in any website.
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Keyboard Shortcuts</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <kbd className="px-1 bg-muted rounded">Ctrl+S</kbd> - Save template</li>
              <li>• <kbd className="px-1 bg-muted rounded">Ctrl+P</kbd> - Toggle preview</li>
              <li>• <kbd className="px-1 bg-muted rounded">Ctrl+E</kbd> - Export code</li>
              <li>• <kbd className="px-1 bg-muted rounded">Delete</kbd> - Delete selected element</li>
            </ul>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Need More Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check out our documentation or contact support for assistance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpPopup;
