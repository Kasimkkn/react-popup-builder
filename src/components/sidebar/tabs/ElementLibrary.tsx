
import React from "react";
import { 
  Type, 
  Pencil,
  MousePointerClick, 
  Image as ImageIcon,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePopup } from "@/contexts/PopupContext";
import { ElementType } from "@/types/popup";

const ElementLibrary: React.FC = () => {
  const { currentTemplate, addElement } = usePopup();
  const firstColumnId = currentTemplate.layout.columns[0]?.id;

  const elements: { type: ElementType; icon: React.ReactNode; label: string }[] = [
    { type: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
    { type: 'button', icon: <MousePointerClick className="h-5 w-5" />, label: 'Button' },
    { type: 'input', icon: <Pencil className="h-5 w-5" />, label: 'Input' },
    { type: 'image', icon: <ImageIcon className="h-5 w-5" />, label: 'Image' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Element Library</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Drag elements to your popup or click to add them
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {elements.map((element) => (
          <Card 
            key={element.type}
            className="hover-scale overflow-hidden group cursor-pointer bg-background"
          >
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                onClick={() => firstColumnId && addElement(element.type, firstColumnId)}
                className="w-full h-full py-3 rounded-none flex flex-col gap-2 items-center justify-center group-hover:bg-secondary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  {element.icon}
                </div>
                <span className="text-sm font-medium">{element.label}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="pt-6">
        <h3 className="text-sm font-medium mb-2">Current Elements</h3>
        <div className="bg-secondary/30 rounded-lg p-3 space-y-1 max-h-60 overflow-y-auto">
          {currentTemplate.layout.columns.flatMap(column => 
            column.elements.map(element => (
              <div 
                key={element.id}
                className="flex items-center justify-between py-1 px-2 text-sm rounded hover:bg-secondary"
              >
                <div className="flex items-center gap-2">
                  {element.type === 'text' && <Type className="h-4 w-4" />}
                  {element.type === 'button' && <MousePointerClick className="h-4 w-4" />}
                  {element.type === 'input' && <Pencil className="h-4 w-4" />}
                  {element.type === 'image' && <ImageIcon className="h-4 w-4" />}
                  <span className="truncate max-w-[180px]">
                    {element.type === 'text' && element.content}
                    {element.type === 'button' && element.label}
                    {element.type === 'input' && element.placeholder}
                    {element.type === 'image' && (element.alt || 'Image')}
                  </span>
                </div>
              </div>
            ))
          )}
          
          {currentTemplate.layout.columns.flatMap(column => column.elements).length === 0 && (
            <div className="text-sm text-muted-foreground py-2 text-center">
              No elements added yet
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3 gap-1"
          onClick={() => firstColumnId && addElement('text', firstColumnId)}
        >
          <Plus className="h-4 w-4" />
          Add Element
        </Button>
      </div>
    </div>
  );
};

export default ElementLibrary;
