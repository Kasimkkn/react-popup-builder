
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePopup } from "@/contexts/PopupContext";
import GeneralSettings from "./tabs/GeneralSettings";
import ElementSettings from "./tabs/ElementSettings";
import ElementLibrary from "./tabs/ElementLibrary";
import TemplateSettings from "./tabs/TemplateSettings";
import LayoutSettings from "./tabs/LayoutSettings";

const SidebarPanel: React.FC = () => {
  const { selectedElementId } = usePopup();
  const [activeTab, setActiveTab] = useState<string>(selectedElementId ? "element" : "general");

  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
      }
    };

    document.addEventListener('tabChange', handleTabChange as EventListener);

    return () => {
      document.removeEventListener('tabChange', handleTabChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (selectedElementId) {
      setActiveTab("element");
    }
  }, [selectedElementId]);

  return (
    <div className="w-96 border-r border-border bg-card overflow-y-auto h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 h-14 p-1 bg-muted/30 rounded-none border-b">
          <TabsTrigger value="general" className="text-sm">General</TabsTrigger>
          <TabsTrigger
            value="element"
            className="text-sm"
            disabled={!selectedElementId}
          >
            Element
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-sm">Layout</TabsTrigger>
          <TabsTrigger value="library" className="text-sm">Library</TabsTrigger>
          <TabsTrigger value="template" className="text-sm">Template</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="general" className="m-0 p-4">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="element" className="m-0 p-4">
            <ElementSettings />
          </TabsContent>

          <TabsContent value="layout" className="m-0 p-4">
            <LayoutSettings />
          </TabsContent>

          <TabsContent value="library" className="m-0 p-4">
            <ElementLibrary />
          </TabsContent>

          <TabsContent value="template" className="m-0 p-4">
            <TemplateSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SidebarPanel;
