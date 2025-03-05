
import React, { useState } from "react";
import { usePopup } from "@/contexts/PopupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Columns, LayoutGrid, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { predefinedColumnLayouts } from "@/types/popup";
import { Separator } from "@/components/ui/separator";

const LayoutSettings: React.FC = () => {
  const { 
    currentTemplate, 
    addRow, 
    addRowWithLayout,
    addColumn, 
    updateColumnWidth, 
    deleteColumn, 
    updateRowHeight 
  } = usePopup();
  
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  
  // Add protection against missing rows
  if (!currentTemplate.layout.rows || !Array.isArray(currentTemplate.layout.rows)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Layout Structure
          </h3>
          <Popover open={showLayoutOptions} onOpenChange={setShowLayoutOptions}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Row
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[280px] p-0">
              <div className="p-3 border-b">
                <h4 className="text-sm font-medium">Select Column Layout</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose a predefined layout or create a custom row
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {predefinedColumnLayouts.map((layout) => (
                  <Button
                    key={layout.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addRowWithLayout(layout.id);
                      setShowLayoutOptions(false);
                    }}
                    className="h-auto p-2 justify-start flex-col items-center w-full"
                  >
                    <LayoutPreview columns={layout.columns} />
                    <span className="text-xs mt-1">{layout.name}</span>
                  </Button>
                ))}
              </div>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    addRow();
                    setShowLayoutOptions(false);
                  }}
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Custom Single Column
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="mt-6 p-3 rounded-md bg-muted/50">
          <p className="text-sm text-muted-foreground">
            No layout structure defined yet. Add a row to get started.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Layout Structure
        </h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Row
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[280px] p-0">
            <div className="p-3 border-b">
              <h4 className="text-sm font-medium">Select Column Layout</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a predefined layout or create a custom row
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              {predefinedColumnLayouts.map((layout) => (
                <Button
                  key={layout.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addRowWithLayout(layout.id)}
                  className="h-auto p-2 justify-start flex-col items-center w-full"
                >
                  <LayoutPreview columns={layout.columns} />
                  <span className="text-xs mt-1">{layout.name}</span>
                </Button>
              ))}
            </div>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addRow()}
                className="w-full justify-start"
              >
                <Plus className="h-4 w-4 mr-1" />
                Custom Single Column
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-4">
        {currentTemplate.layout.rows.map((row, rowIndex) => (
          <div key={row.id} className="border p-3 rounded-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-medium">Row {rowIndex + 1}</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={row.height || "auto"}
                  onChange={(e) => updateRowHeight(row.id, e.target.value)}
                  placeholder="e.g., auto, 100px"
                  className="w-24 h-8"
                />
                <span className="text-xs text-muted-foreground">height</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs text-muted-foreground">
                {row.columns.length} column{row.columns.length !== 1 ? 's' : ''}
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                  >
                    <Columns className="h-4 w-4 mr-1" />
                    Column Options
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[200px] p-0">
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addColumn(row.id)}
                      className="w-full justify-start"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Column
                    </Button>
                  </div>
                  <Separator />
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Reset to equal width columns
                        const equalWidth = `${Math.floor(100 / row.columns.length)}%`;
                        row.columns.forEach(col => updateColumnWidth(row.id, col.id, equalWidth));
                      }}
                      className="w-full justify-start"
                    >
                      <LayoutGrid className="h-4 w-4 mr-1" />
                      Equal Widths
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-3">
              {row.columns && row.columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2 border p-3 rounded-md">
                  <div className="flex-1">
                    <Label htmlFor={`col-width-${column.id}`} className="mb-1 block">
                      Column Width
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`col-width-${column.id}`}
                        value={column.ratio}
                        onChange={(e) => updateColumnWidth(row.id, column.id, e.target.value)}
                        placeholder="e.g., 50%"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        ({column.elements && column.elements.length || 0} elements)
                      </span>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={!row.columns || row.columns.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Column</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this column? All elements inside this column will be deleted as well.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteColumn(row.id, column.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 rounded-md bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Rows and columns allow you to create sophisticated layouts. Enter percentages (e.g., "50%") 
          or fixed values (e.g., "200px") for widths and heights.
        </p>
      </div>
    </div>
  );
};

// Component to render a preview of the column layout
const LayoutPreview: React.FC<{ columns: string[] }> = ({ columns }) => {
  return (
    <div className="flex w-full h-6 border rounded overflow-hidden">
      {columns.map((width, i) => {
        // Convert percentage string to number
        const widthValue = parseFloat(width);
        return (
          <div 
            key={i}
            className="h-full bg-secondary border-r last:border-r-0" 
            style={{ 
              width: `${widthValue}%`,
              minWidth: widthValue < 10 ? '10%' : undefined // Ensure small columns are still visible
            }}
          />
        );
      })}
    </div>
  );
};

export default LayoutSettings;
