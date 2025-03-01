
import React, { useEffect } from "react";
import LivePreview from "./LivePreview";
import CodeView from "./CodeView";
import { usePopup } from "@/contexts/PopupContext";
import WelcomeScreen from "../welcome/WelcomeScreen";

// Create an interface for the tab switching event
interface TabChangeEvent extends CustomEvent {
  detail: {
    tab: string;
  }
}

const PreviewPanel: React.FC = () => {
  const { isCodeVisible, templates, selectedElementId } = usePopup();

  // Automatically switch to Element tab when an element is selected
  useEffect(() => {
    if (selectedElementId) {
      // Create and dispatch custom event to switch tabs
      const tabChangeEvent = new CustomEvent('tabChange', {
        detail: { tab: 'element' }
      }) as TabChangeEvent;
      
      document.dispatchEvent(tabChangeEvent);
    }
  }, [selectedElementId]);

  // Show welcome screen when there are no templates
  if (templates.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex-1 overflow-hidden">
      {isCodeVisible ? <CodeView /> : <LivePreview />}
    </div>
  );
};

export default PreviewPanel;
