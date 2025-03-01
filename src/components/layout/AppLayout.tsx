
import React, { useEffect } from "react";
import AppHeader from "./AppHeader";
import SidebarPanel from "../sidebar/SidebarPanel";
import PreviewPanel from "../preview/PreviewPanel";
import HelpPopup from "../help/HelpPopup";
import { usePopup } from "@/contexts/PopupContext";
import { useToast } from "@/hooks/use-toast";

const AppLayout: React.FC = () => {
  const { isPreviewVisible, saveCurrentTemplate } = usePopup();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentTemplate();
        toast({
          title: "Template saved",
          variant: "default"
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveCurrentTemplate, toast]);

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <SidebarPanel />

        {isPreviewVisible && <PreviewPanel />}
      </div>

      <HelpPopup />
    </div>
  );
};

export default AppLayout;
