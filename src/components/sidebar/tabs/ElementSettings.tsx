
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { usePopup } from "@/contexts/PopupContext";
import {
  ButtonAction,
  InputType
} from "@/types/popup";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowUpDown,
  BoxSelect,
  Link as LinkIcon,
  MoveHorizontal,
  Plus,
  Trash,
  Type as TypeIcon,
  X
} from "lucide-react";
import React from "react";

const ElementSettings: React.FC = () => {
  const { currentTemplate, selectedElementId, updateElement, deleteElement, selectElement } = usePopup();

  if (!selectedElementId) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  // Find the selected element in the template - searching through all rows and columns
  const findSelectedElement = () => {
    if (!currentTemplate.layout.rows) return null;

    for (const row of currentTemplate.layout.rows) {
      if (!row.columns) continue;

      for (const column of row.columns) {
        if (!column.elements) continue;

        const element = column.elements.find(el => el.id === selectedElementId);
        if (element) return element;
      }
    }

    return null;
  };

  const selectedElement = findSelectedElement();

  if (!selectedElement) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Element not found</p>
      </div>
    );
  }

  const handleTextAlignmentChange = (alignment: string) => {
    updateElement(selectedElementId, {
      styles: {
        ...selectedElement.styles,
        alignment
      }
    });
  };

  const handleDeleteElement = () => {
    deleteElement(selectedElementId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create an object URL for the uploaded file
    const imageUrl = URL.createObjectURL(file);
    updateElement(selectedElementId, { imageUrl });

    // Show toast notification
    const event = new CustomEvent('toast', {
      detail: {
        title: 'Image uploaded',
        description: 'Your image has been uploaded successfully'
      }
    });
    document.dispatchEvent(event);
  };

  const getElementIcon = () => {
    switch (selectedElement.type) {
      case 'text':
        return <TypeIcon className="h-4 w-4 mr-2" />;
      case 'button':
        return <BoxSelect className="h-4 w-4 mr-2" />;
      case 'input':
        return <TypeIcon className="h-4 w-4 mr-2" />;
      case 'image':
        return <TypeIcon className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  // Add a new option for select, radio, or checkbox inputs
  const addOption = () => {
    const options = selectedElement.options || [];
    const newOption = { value: `option-${options.length + 1}`, label: `Option ${options.length + 1}` };

    updateElement(selectedElementId, {
      options: [...options, newOption]
    });
  };

  // Remove an option from select, radio, or checkbox inputs
  const removeOption = (index: number) => {
    const options = [...(selectedElement.options || [])];
    options.splice(index, 1);

    updateElement(selectedElementId, {
      options: options
    });
  };

  // Update an option's label or value
  const updateOption = (index: number, field: 'label' | 'value', value: string) => {
    const options = [...(selectedElement.options || [])];
    options[index] = { ...options[index], [field]: value };

    updateElement(selectedElementId, {
      options: options
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          {getElementIcon()}
          <span className="capitalize">{selectedElement.type} Element</span>
        </h2>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Element</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this element? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteElement}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          {selectedElement.type === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="content">Text Content</Label>
              <Textarea
                id="content"
                value={selectedElement.content || ''}
                onChange={(e) => updateElement(selectedElementId, { content: e.target.value })}
                rows={3}
              />
            </div>
          )}

          {selectedElement.type === 'button' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="button-label">Button Text</Label>
                <Input
                  id="button-label"
                  value={selectedElement.label || ''}
                  onChange={(e) => updateElement(selectedElementId, { label: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-action">Action</Label>
                <Select
                  value={selectedElement.action || 'close'}
                  onValueChange={(value) => updateElement(selectedElementId, {
                    action: value as ButtonAction
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="close">Close Popup</SelectItem>
                    <SelectItem value="link">Open Link</SelectItem>
                    <SelectItem value="submit">Submit Form</SelectItem>
                    <SelectItem value="custom">Custom JS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedElement.action === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="button-url">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="button-url"
                      value={selectedElement.actionUrl || ''}
                      onChange={(e) => updateElement(selectedElementId, { actionUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      type="button"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Input Element Content */}
          {selectedElement.type === 'input' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="input-type">Input Type</Label>
                <Select
                  value={selectedElement.inputType || 'text'}
                  onValueChange={(value) => {
                    const inputType = value as InputType;
                    const updates: any = { inputType };

                    if (['select', 'radio', 'checkbox'].includes(inputType) && !selectedElement.options) {
                      updates.options = [
                        { value: 'option-1', label: 'Option 1' },
                        { value: 'option-2', label: 'Option 2' }
                      ];
                    }

                    if (inputType === 'radio' && !selectedElement.name) {
                      updates.name = `radio-group-${Date.now()}`;
                    }

                    updateElement(selectedElementId, updates);
                  }}
                >
                  <SelectTrigger id="input-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="password">Password</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-label">Label</Label>
                <Input
                  id="input-label"
                  value={selectedElement.label || ''}
                  onChange={(e) => updateElement(selectedElementId, { label: e.target.value })}
                  placeholder="Enter label text"
                />
              </div>

              {(selectedElement.inputType === 'text' ||
                selectedElement.inputType === 'email' ||
                selectedElement.inputType === 'number' ||
                selectedElement.inputType === 'password' ||
                selectedElement.inputType === 'textarea') && (
                  <div className="space-y-2">
                    <Label htmlFor="input-placeholder">Placeholder</Label>
                    <Input
                      id="input-placeholder"
                      value={selectedElement.placeholder || ''}
                      onChange={(e) => updateElement(selectedElementId, { placeholder: e.target.value })}
                    />
                  </div>
                )}

              {['select', 'radio', 'checkbox'].includes(selectedElement.inputType || '') && (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="h-8"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(selectedElement.options || []).map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option.label}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                          placeholder="Option label"
                          className="flex-1"
                        />
                        <Input
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-1/3"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {(!selectedElement.options || selectedElement.options.length === 0) && (
                      <div className="text-center p-2 text-sm text-muted-foreground">
                        No options added yet. Click "Add Option" to add one.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedElement.inputType === 'radio' && (
                <div className="space-y-2">
                  <Label htmlFor="radio-name">Radio Group Name</Label>
                  <Input
                    id="radio-name"
                    value={selectedElement.name || ''}
                    onChange={(e) => updateElement(selectedElementId, { name: e.target.value })}
                    placeholder="Enter radio group name"
                  />
                </div>
              )}

              <div className="pt-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedElement.required || false}
                    onChange={(e) => updateElement(selectedElementId, { required: e.target.checked })}
                  />
                  Required field
                </Label>
              </div>
            </>
          )}

          {/* Image Element Content */}
          {selectedElement.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={selectedElement.imageUrl || ''}
                  onChange={(e) => updateElement(selectedElementId, { imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="image-upload">Or Upload Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {selectedElement.imageUrl && (
                  <div className="mt-2 border rounded overflow-hidden w-full max-w-xs">
                    <img
                      src={selectedElement.imageUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-alt">Alt Text</Label>
                <Input
                  id="image-alt"
                  value={selectedElement.alt || ''}
                  onChange={(e) => updateElement(selectedElementId, { alt: e.target.value })}
                  placeholder="Image description"
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="style" className="space-y-4 pt-4">
          {/* Common style settings for all element types */}
          <div className="grid grid-cols-2 gap-3">
            {/* Color settings depend on element type */}
            {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'input') && (
              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded border overflow-hidden">
                    <input
                      type="color"
                      id="text-color"
                      value={selectedElement.styles.textColor || '#000000'}
                      onChange={(e) => updateElement(selectedElementId, {
                        styles: { ...selectedElement.styles, textColor: e.target.value }
                      })}
                      className="w-10 h-10 -ml-1 -mt-1"
                    />
                  </div>
                  <Input
                    value={selectedElement.styles.textColor || ''}
                    onChange={(e) => updateElement(selectedElementId, {
                      styles: { ...selectedElement.styles, textColor: e.target.value }
                    })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {(selectedElement.type === 'button' || selectedElement.type === 'input') && (
              <div className="space-y-2">
                <Label htmlFor="element-bg-color">Background</Label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded border overflow-hidden">
                    <input
                      type="color"
                      id="element-bg-color"
                      value={selectedElement.styles.backgroundColor || '#ffffff'}
                      onChange={(e) => updateElement(selectedElementId, {
                        styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                      })}
                      className="w-10 h-10 -ml-1 -mt-1"
                    />
                  </div>
                  <Input
                    value={selectedElement.styles.backgroundColor || ''}
                    onChange={(e) => updateElement(selectedElementId, {
                      styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                    })}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Font size for text, buttons, and inputs */}
            {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'input') && (
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Input
                  id="font-size"
                  value={selectedElement.styles.fontSize || ''}
                  onChange={(e) => updateElement(selectedElementId, {
                    styles: { ...selectedElement.styles, fontSize: e.target.value }
                  })}
                  placeholder="16px"
                />
              </div>
            )}

            {/* Font weight */}
            {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'input') && (
              <div className="space-y-2">
                <Label htmlFor="font-weight">Font Weight</Label>
                <Select
                  value={selectedElement.styles.fontWeight || '400'}
                  onValueChange={(value) => updateElement(selectedElementId, {
                    styles: { ...selectedElement.styles, fontWeight: value }
                  })}
                >
                  <SelectTrigger id="font-weight">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Regular (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi-Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra-Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Border settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center">
              <BoxSelect className="h-4 w-4 mr-2" />
              Border
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="border-radius">Border Radius</Label>
                <Input
                  id="border-radius"
                  value={selectedElement.styles.borderRadius || ''}
                  onChange={(e) => updateElement(selectedElementId, {
                    styles: { ...selectedElement.styles, borderRadius: e.target.value }
                  })}
                  placeholder="4px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="border-width">Border Width</Label>
                <Input
                  id="border-width"
                  value={selectedElement.styles.borderWidth || ''}
                  onChange={(e) => updateElement(selectedElementId, {
                    styles: { ...selectedElement.styles, borderWidth: e.target.value }
                  })}
                  placeholder="1px"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="border-color">Border Color</Label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded border overflow-hidden">
                    <input
                      type="color"
                      id="border-color"
                      value={selectedElement.styles.borderColor || '#000000'}
                      onChange={(e) => updateElement(selectedElementId, {
                        styles: { ...selectedElement.styles, borderColor: e.target.value }
                      })}
                      className="w-10 h-10 -ml-1 -mt-1"
                    />
                  </div>
                  <Input
                    value={selectedElement.styles.borderColor || ''}
                    onChange={(e) => updateElement(selectedElementId, {
                      styles: { ...selectedElement.styles, borderColor: e.target.value }
                    })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text alignment */}
          {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'input') && (
            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <div className="flex">
                <Button
                  type="button"
                  variant={selectedElement.styles.alignment === 'left' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleTextAlignmentChange('left')}
                  className="rounded-r-none"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={selectedElement.styles.alignment === 'center' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleTextAlignmentChange('center')}
                  className="rounded-none border-x-0"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={selectedElement.styles.alignment === 'right' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleTextAlignmentChange('right')}
                  className="rounded-l-none"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Custom CSS */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="custom-css">
              <AccordionTrigger className="text-sm">Custom CSS</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="el-custom-css">Custom CSS</Label>
                  <Textarea
                    id="el-custom-css"
                    value={selectedElement.styles.customCSS || ''}
                    onChange={(e) => updateElement(selectedElementId, {
                      styles: { ...selectedElement.styles, customCSS: e.target.value }
                    })}
                    placeholder="transform: rotate(5deg); opacity: 0.9;"
                    rows={3}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 pt-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center">
              <MoveHorizontal className="h-4 w-4 mr-2" />
              Dimensions
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="el-width">Width</Label>
                <Input
                  id="el-width"
                  value={selectedElement.styles.width || ''}
                  onChange={(e) => updateElement(selectedElementId, {
                    styles: { ...selectedElement.styles, width: e.target.value }
                  })}
                  placeholder="100%"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="el-height">Height</Label>
                <Input
                  id="el-height"
                  value={selectedElement.styles.height || ''}
                  onChange={(e) => updateElement(selectedElementId, {
                    styles: { ...selectedElement.styles, height: e.target.value }
                  })}
                  placeholder="auto"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Spacing
            </h4>

            <div className="space-y-2">
              <Label htmlFor="el-margin">Margin</Label>
              <Input
                id="el-margin"
                value={selectedElement.styles.margin || ''}
                onChange={(e) => updateElement(selectedElementId, {
                  styles: { ...selectedElement.styles, margin: e.target.value }
                })}
                placeholder="0px 0px 16px 0px"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="el-padding">Padding</Label>
              <Input
                id="el-padding"
                value={selectedElement.styles.padding || ''}
                onChange={(e) => updateElement(selectedElementId, {
                  styles: { ...selectedElement.styles, padding: e.target.value }
                })}
                placeholder="8px 16px"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElementSettings;