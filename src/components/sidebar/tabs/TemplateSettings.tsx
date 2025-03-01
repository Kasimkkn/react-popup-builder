
import React from "react";
import { 
  Copy, 
  Trash2, 
  DownloadCloud,
  FileCode,
  Save
} from "lucide-react";
import { usePopup } from "@/contexts/PopupContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { generatePopupCode } from "@/utils/code-generator";
import { useToast } from "@/hooks/use-toast";
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

const TemplateSettings: React.FC = () => {
  const { 
    currentTemplate,
    updateCurrentTemplate,
    saveCurrentTemplate,
    templates,
    loadTemplate,
    cloneTemplate,
    removeTemplate,
    createTemplate
  } = usePopup();
  
  const { toast } = useToast();
  
  const exportTemplate = () => {
    const templateJson = JSON.stringify(currentTemplate, null, 2);
    const blob = new Blob([templateJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Template exported",
      description: `${currentTemplate.name}.json downloaded`,
      variant: "default",
    });
  };
  
  const exportCode = () => {
    const code = generatePopupCode(currentTemplate);
    navigator.clipboard.writeText(code);
    
    toast({
      title: "Code copied to clipboard",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Template Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <div className="flex gap-2">
            <Input 
              id="template-name" 
              value={currentTemplate.name} 
              onChange={(e) => updateCurrentTemplate({ name: e.target.value })}
              placeholder="My Popup Template"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={saveCurrentTemplate}
              title="Save Template"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={createTemplate}
            className="flex items-center gap-1"
          >
            New Template
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => cloneTemplate(currentTemplate.id)}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportTemplate}
            className="flex items-center gap-1"
          >
            <DownloadCloud className="h-4 w-4 mr-1" />
            Export JSON
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportCode}
            className="flex items-center gap-1"
          >
            <FileCode className="h-4 w-4 mr-1" />
            Copy Code
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Template</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this template? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => removeTemplate(currentTemplate.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-md font-medium mb-3">Saved Templates</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {templates.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No templates saved yet
            </div>
          ) : (
            templates.map((template) => (
              <Card key={template.id} className={`${template.id === currentTemplate.id ? 'border-primary' : ''}`}>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {template.layout.columns.flatMap(c => c.elements).length} elements
                  </CardDescription>
                </CardHeader>
                <CardFooter className="py-2 px-4 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => loadTemplate(template.id)}
                    disabled={template.id === currentTemplate.id}
                  >
                    {template.id === currentTemplate.id ? 'Current' : 'Load'}
                  </Button>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => cloneTemplate(template.id)}
                      className="h-7 w-7"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Template</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{template.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeTemplate(template.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSettings;
