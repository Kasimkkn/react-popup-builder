
import React from "react";
import { usePopup } from "@/contexts/PopupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Columns } from "lucide-react";
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

const LayoutSettings: React.FC = () => {
  const { currentTemplate, addColumn, updateColumnWidth, deleteColumn } = usePopup();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Columns className="h-4 w-4 mr-2" />
          Layout Structure
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addColumn}
          className="flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Column
        </Button>
      </div>
      
      <div className="space-y-4">
        {currentTemplate.layout.columns.map((column) => (
          <div key={column.id} className="flex items-center space-x-2 border p-3 rounded-md">
            <div className="flex-1">
              <Label htmlFor={`col-width-${column.id}`} className="mb-1 block">
                Column Width
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`col-width-${column.id}`}
                  value={column.ratio}
                  onChange={(e) => updateColumnWidth(column.id, e.target.value)}
                  placeholder="e.g., 50%"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  ({column.elements.length} elements)
                </span>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  disabled={currentTemplate.layout.columns.length <= 1}
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
                  <AlertDialogAction onClick={() => deleteColumn(column.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 rounded-md bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Columns allow you to create side-by-side layouts. Enter percentages (e.g., "50%") 
          or fixed values (e.g., "200px") for column widths.
        </p>
      </div>
    </div>
  );
};

export default LayoutSettings;
