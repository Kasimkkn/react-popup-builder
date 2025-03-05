
import React, { useState, useEffect } from "react";
import { 
  Type, 
  Pencil,
  MousePointerClick, 
  Image as ImageIcon,
  Plus,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePopup } from "@/contexts/PopupContext";
import { ElementType } from "@/types/popup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ElementLibrary: React.FC = () => {
  const { currentTemplate, addElement } = usePopup();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [elementTypeToAdd, setElementTypeToAdd] = useState<ElementType | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Check if layout has a simple structure (1 row, 1 column)
  const hasSimpleLayout = currentTemplate.layout.rows && 
                        currentTemplate.layout.rows.length === 1 && 
                        currentTemplate.layout.rows[0]?.columns?.length === 1;

  const firstRowId = currentTemplate.layout.rows?.[0]?.id || null;
  const firstColumnId = currentTemplate.layout.rows?.[0]?.columns?.[0]?.id || null;

  // Update selected row/column when template changes
  useEffect(() => {
    if (firstRowId && (!selectedRowId || !currentTemplate.layout.rows?.some(r => r.id === selectedRowId))) {
      setSelectedRowId(firstRowId);
    }
    
    if (firstColumnId && (!selectedColumnId || !currentTemplate.layout.rows?.some(r => 
      r.columns?.some(c => c.id === selectedColumnId)
    ))) {
      setSelectedColumnId(firstColumnId);
    }
  }, [currentTemplate, firstRowId, firstColumnId, selectedRowId, selectedColumnId]);

  const elements: { type: ElementType; icon: React.ReactNode; label: string }[] = [
    { type: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
    { type: 'button', icon: <MousePointerClick className="h-5 w-5" />, label: 'Button' },
    { type: 'input', icon: <Pencil className="h-5 w-5" />, label: 'Input' },
    { type: 'image', icon: <ImageIcon className="h-5 w-5" />, label: 'Image' }
  ];

  const handleElementClick = (type: ElementType) => {
    if (hasSimpleLayout && firstRowId && firstColumnId) {
      addElement(type, firstRowId, firstColumnId);
      return;
    }

    setElementTypeToAdd(type);
    setShowDialog(true);
  };

  const handleAddElement = () => {
    if (elementTypeToAdd && selectedRowId && selectedColumnId) {
      addElement(elementTypeToAdd, selectedRowId, selectedColumnId);
      setShowDialog(false);
      setElementTypeToAdd(null);
      setSelectedRowId(null);
      setSelectedColumnId(null);
    }
  };

  const handleRowChange = (rowId: string) => {
    setSelectedRowId(rowId);
    const selectedRow = currentTemplate.layout.rows?.find(r => r.id === rowId);
    if (selectedRow && selectedRow.columns && selectedRow.columns.length > 0) {
      setSelectedColumnId(selectedRow.columns[0].id);
    } else {
      setSelectedColumnId(null);
    }
  };

  // Get all elements from the layout
  const getAllElements = () => {
    if (!currentTemplate.layout.rows) return [];
    
    const allElements: any[] = [];
    
    currentTemplate.layout.rows.forEach(row => {
      if (!row.columns) return;
      
      row.columns.forEach(column => {
        if (!column.elements) return;
        
        column.elements.forEach(element => {
          allElements.push(element);
        });
      });
    });
    
    return allElements;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Element Library</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Click elements to add them to your popup
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
                onClick={() => handleElementClick(element.type)}
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
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Element to Layout</DialogTitle>
            <DialogDescription>
              Select where you want to add the new {elementTypeToAdd} element.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="row">Select Row</Label>
              <Select
                value={selectedRowId || ""}
                onValueChange={handleRowChange}
              >
                <SelectTrigger id="row">
                  <SelectValue placeholder="Select a row" />
                </SelectTrigger>
                <SelectContent>
                  {currentTemplate.layout.rows?.map((row, index) => (
                    <SelectItem key={row.id} value={row.id}>
                      Row {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="column">Select Column</Label>
              <Select
                value={selectedColumnId || ""}
                onValueChange={setSelectedColumnId}
                disabled={!selectedRowId}
              >
                <SelectTrigger id="column">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {selectedRowId && currentTemplate.layout.rows?.find(r => r.id === selectedRowId)?.columns?.map((column, index) => (
                    <SelectItem key={column.id} value={column.id}>
                      Column {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddElement} disabled={!selectedRowId || !selectedColumnId}>
              Add Element
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="pt-6">
        <h3 className="text-sm font-medium mb-2">Current Elements</h3>
        <div className="bg-secondary/30 rounded-lg p-3 space-y-1 max-h-60 overflow-y-auto">
          {getAllElements().map(element => (
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
          ))}
          
          {getAllElements().length === 0 && (
            <div className="text-sm text-muted-foreground py-2 text-center">
              No elements added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementLibrary;
