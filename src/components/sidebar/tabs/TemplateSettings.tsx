import React, { useState } from "react";
import { usePopup } from "@/contexts/PopupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, 
  Trash2, 
  Save, 
  Plus, 
  FileJson, 
  Download, 
  Upload,
  Settings,
  LayoutGrid
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { PopupPosition, PopupAnimation } from "@/types/popup";

const TemplateSettings: React.FC = () => {
  const { 
    templates, 
    currentTemplate, 
    updateCurrentTemplate, 
    saveCurrentTemplate, 
    createTemplate, 
    loadTemplate, 
    removeTemplate, 
    cloneTemplate 
  } = usePopup();
  
  const [exportedJson, setExportedJson] = useState<string>("");
  const [importJson, setImportJson] = useState<string>("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  const handleExport = () => {
    const jsonStr = JSON.stringify(currentTemplate, null, 2);
    setExportedJson(jsonStr);
    setShowExportDialog(true);
  };
  
  const handleImport = () => {
    try {
      const importedTemplate = JSON.parse(importJson);
      
      // Basic validation
      if (!importedTemplate.id || !importedTemplate.name || !importedTemplate.layout) {
        throw new Error("Invalid template format");
      }
      
      updateCurrentTemplate(importedTemplate);
      saveCurrentTemplate();
      setShowImportDialog(false);
      setImportJson("");
      
      // Show toast notification
      const event = new CustomEvent('toast', {
        detail: {
          title: 'Template imported',
          description: `"${importedTemplate.name}" has been imported successfully`
        }
      });
      document.dispatchEvent(event);
    } catch (error) {
      // Show error toast
      const event = new CustomEvent('toast', {
        detail: {
          title: 'Import failed',
          description: 'The JSON format is invalid',
          variant: 'destructive'
        }
      });
      document.dispatchEvent(event);
    }
  };
  
  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportedJson);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentTemplate.name.replace(/\s+/g, '-').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  const positionOptions: { value: PopupPosition; label: string }[] = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'center-left', label: 'Center Left' },
    { value: 'center', label: 'Center' },
    { value: 'center-right', label: 'Center Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];
  
  const animationOptions: { value: PopupAnimation; label: string }[] = [
    { value: 'fade-in', label: 'Fade In' },
    { value: 'scale-in', label: 'Scale In' },
    { value: 'slide-in-top', label: 'Slide In (Top)' },
    { value: 'slide-in-right', label: 'Slide In (Right)' },
    { value: 'slide-in-bottom', label: 'Slide In (Bottom)' },
    { value: 'slide-in-left', label: 'Slide In (Left)' },
    { value: 'none', label: 'None' }
  ];
  
  const getElementCount = () => {
    if (!currentTemplate.layout.rows) return 0;
    
    return currentTemplate.layout.rows.reduce((total, row) => {
      if (!row.columns) return total;
      
      return total + row.columns.reduce((colTotal, col) => {
        return colTotal + (col.elements?.length || 0);
      }, 0);
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Template Settings
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveCurrentTemplate}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => cloneTemplate(currentTemplate.id)}
            className="flex items-center"
          >
            <Copy className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input 
            id="template-name" 
            value={currentTemplate.name} 
            onChange={(e) => updateCurrentTemplate({ name: e.target.value })}
            placeholder="My Popup Template"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Template ID:</span> {currentTemplate.id.substring(0, 8)}...
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Elements:</span> {getElementCount()}
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4 pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Popup Appearance</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="popup-width">Width</Label>
                <Input 
                  id="popup-width" 
                  value={currentTemplate.popupStyles.width || ''} 
                  onChange={(e) => updateCurrentTemplate({ 
                    popupStyles: { ...currentTemplate.popupStyles, width: e.target.value }
                  })}
                  placeholder="400px"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="popup-height">Height</Label>
                <Input 
                  id="popup-height" 
                  value={currentTemplate.popupStyles.height || ''} 
                  onChange={(e) => updateCurrentTemplate({ 
                    popupStyles: { ...currentTemplate.popupStyles, height: e.target.value }
                  })}
                  placeholder="auto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="popup-background">Background</Label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded border overflow-hidden">
                    <input 
                      type="color" 
                      id="popup-background" 
                      value={currentTemplate.popupStyles.background || '#ffffff'} 
                      onChange={(e) => updateCurrentTemplate({ 
                        popupStyles: { ...currentTemplate.popupStyles, background: e.target.value }
                      })}
                      className="w-10 h-10 -ml-1 -mt-1"
                    />
                  </div>
                  <Input 
                    value={currentTemplate.popupStyles.background || ''} 
                    onChange={(e) => updateCurrentTemplate({ 
                      popupStyles: { ...currentTemplate.popupStyles, background: e.target.value }
                    })}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="popup-border-radius">Border Radius</Label>
                <Input 
                  id="popup-border-radius" 
                  value={currentTemplate.popupStyles.borderRadius || ''} 
                  onChange={(e) => updateCurrentTemplate({ 
                    popupStyles: { ...currentTemplate.popupStyles, borderRadius: e.target.value }
                  })}
                  placeholder="8px"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="popup-padding">Padding</Label>
                <Input 
                  id="popup-padding" 
                  value={currentTemplate.popupStyles.padding || ''} 
                  onChange={(e) => updateCurrentTemplate({ 
                    popupStyles: { ...currentTemplate.popupStyles, padding: e.target.value }
                  })}
                  placeholder="24px"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="popup-position">Position</Label>
                <Select
                  value={currentTemplate.popupStyles.position}
                  onValueChange={(value) => updateCurrentTemplate({ 
                    popupStyles: { ...currentTemplate.popupStyles, position: value as PopupPosition }
                  })}
                >
                  <SelectTrigger id="popup-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Overlay</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="overlay-background">Background</Label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded border overflow-hidden">
                    <input 
                      type="color" 
                      id="overlay-background" 
                      value={currentTemplate.overlayStyles.background || '#000000'} 
                      onChange={(e) => updateCurrentTemplate({ 
                        overlayStyles: { ...currentTemplate.overlayStyles, background: e.target.value }
                      })}
                      className="w-10 h-10 -ml-1 -mt-1"
                    />
                  </div>
                  <Input 
                    value={currentTemplate.overlayStyles.background || ''} 
                    onChange={(e) => updateCurrentTemplate({ 
                      overlayStyles: { ...currentTemplate.overlayStyles, background: e.target.value }
                    })}
                    placeholder="rgba(0, 0, 0, 0.5)"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overlay-opacity">Opacity</Label>
                <Input 
                  id="overlay-opacity" 
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentTemplate.overlayStyles.opacity || '1'} 
                  onChange={(e) => updateCurrentTemplate({ 
                    overlayStyles: { ...currentTemplate.overlayStyles, opacity: e.target.value }
                  })}
                  placeholder="1"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Close Button</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="close-button-enabled" 
                    checked={currentTemplate.closeButton.enabled} 
                    onChange={(e) => updateCurrentTemplate({ 
                      closeButton: { ...currentTemplate.closeButton, enabled: e.target.checked }
                    })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="close-button-enabled">Show close button</Label>
                </div>
              </div>
              
              {currentTemplate.closeButton.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="close-button-position">Position</Label>
                    <Select
                      value={currentTemplate.closeButton.position}
                      onValueChange={(value) => updateCurrentTemplate({ 
                        closeButton: { ...currentTemplate.closeButton, position: value as 'inside' | 'outside' | 'none' }
                      })}
                    >
                      <SelectTrigger id="close-button-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inside">Inside</SelectItem>
                        <SelectItem value="outside">Outside</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="close-button-color">Color</Label>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded border overflow-hidden">
                        <input 
                          type="color" 
                          id="close-button-color" 
                          value={currentTemplate.closeButton.styles.textColor || '#64748b'} 
                          onChange={(e) => updateCurrentTemplate({ 
                            closeButton: { 
                              ...currentTemplate.closeButton, 
                              styles: { ...currentTemplate.closeButton.styles, textColor: e.target.value }
                            }
                          })}
                          className="w-10 h-10 -ml-1 -mt-1"
                        />
                      </div>
                      <Input 
                        value={currentTemplate.closeButton.styles.textColor || ''} 
                        onChange={(e) => updateCurrentTemplate({ 
                          closeButton: { 
                            ...currentTemplate.closeButton, 
                            styles: { ...currentTemplate.closeButton.styles, textColor: e.target.value }
                          }
                        })}
                        placeholder="#64748b"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-4 pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Animation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="animation-type">Animation Type</Label>
              <Select
                value={currentTemplate.animation}
                onValueChange={(value) => updateCurrentTemplate({ 
                  animation: value as PopupAnimation
                })}
              >
                <SelectTrigger id="animation-type">
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  {animationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Trigger</h3>
            
            <div className="space-y-2">
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select
                value={currentTemplate.trigger.type}
                onValueChange={(value) => updateCurrentTemplate({ 
                  trigger: { ...currentTemplate.trigger, type: value as 'onLoad' | 'onDelay' | 'onClick' }
                })}
              >
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onLoad">On Page Load</SelectItem>
                  <SelectItem value="onDelay">After Delay</SelectItem>
                  <SelectItem value="onClick">On Click</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {currentTemplate.trigger.type === 'onDelay' && (
              <div className="space-y-2">
                <Label htmlFor="trigger-delay">Delay (seconds)</Label>
                <Input 
                  id="trigger-delay" 
                  type="number"
                  min="0"
                  value={currentTemplate.trigger.delay || '0'} 
                  onChange={(e) => updateCurrentTemplate({ 
                    trigger: { ...currentTemplate.trigger, delay: e.target.value }
                  })}
                  placeholder="3"
                />
              </div>
            )}
            
            {currentTemplate.trigger.type === 'onClick' && (
              <div className="space-y-2">
                <Label htmlFor="trigger-element">Element ID or Class</Label>
                <Input 
                  id="trigger-element" 
                  value={currentTemplate.trigger.elementId || ''} 
                  onChange={(e) => updateCurrentTemplate({ 
                    trigger: { ...currentTemplate.trigger, elementId: e.target.value }
                  })}
                  placeholder="#button-id or .button-class"
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4 pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Template Management</h3>
            
            <div className="space-y-2">
              <Label>Available Templates</Label>
              <div className="border rounded-md divide-y">
                {templates.map((template) => (
                  <div 
                    key={template.id} 
                    className={`flex items-center justify-between p-3 ${template.id === currentTemplate.id ? 'bg-secondary/40' : 'hover:bg-secondary/20'}`}
                  >
                    <div className="flex items-center">
                      <LayoutGrid className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => loadTemplate(template.id)}
                        disabled={template.id === currentTemplate.id}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => cloneTemplate(template.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            disabled={templates.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Template</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{template.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeTemplate(template.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={createTemplate}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Template
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowImportDialog(true)}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Export Dialog */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent className="sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <FileJson className="h-4 w-4 mr-2" />
              Export Template
            </AlertDialogTitle>
            <AlertDialogDescription>
              Copy the JSON below or download it as a file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Textarea 
              value={exportedJson} 
              readOnly 
              className="font-mono text-xs h-60"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          </div>
          
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Close
            </Button>
            <Button onClick={downloadJson}>
              <Download className="h-4 w-4 mr-1" />
              Download JSON
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Import Dialog */}
      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent className="sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <FileJson className="h-4 w-4 mr-2" />
              Import Template
            </AlertDialogTitle>
            <AlertDialogDescription>
              Paste the template JSON below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Textarea 
              value={importJson} 
              onChange={(e) => setImportJson(e.target.value)}
              className="font-mono text-xs h-60"
              placeholder="Paste template JSON here..."
            />
          </div>
          
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importJson.trim()}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TemplateSettings;
