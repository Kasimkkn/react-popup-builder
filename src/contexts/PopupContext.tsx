
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  PopupTemplate,
  PopupElement,
  ElementType,
  defaultPopupTemplate,
  LayoutColumn
} from "@/types/popup";
import {
  getOrCreateTemplates,
  saveTemplate,
  getTemplateById,
  deleteTemplate,
  duplicateTemplate
} from "@/utils/templates";
import { useToast } from "@/hooks/use-toast";

interface PopupContextType {
  templates: PopupTemplate[];
  currentTemplate: PopupTemplate;
  isPreviewVisible: boolean;
  isCodeVisible: boolean;
  selectedElementId: string | null;
  setCurrentTemplate: (template: PopupTemplate) => void;
  updateCurrentTemplate: (updates: Partial<PopupTemplate>) => void;
  addElement: (type: ElementType, columnId: string) => void;
  updateElement: (elementId: string, updates: Partial<PopupElement>) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  saveCurrentTemplate: () => void;
  createTemplate: () => void;
  loadTemplate: (id: string) => void;
  removeTemplate: (id: string) => void;
  cloneTemplate: (id: string) => void;
  togglePreview: () => void;
  toggleCodeView: () => void;
  addColumn: () => void;
  updateColumnWidth: (columnId: string, width: string) => void;
  deleteColumn: (columnId: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<PopupTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<PopupTemplate>(defaultPopupTemplate);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadedTemplates = getOrCreateTemplates();
    setTemplates(loadedTemplates);

    if (loadedTemplates.length > 0) {
      setCurrentTemplate(loadedTemplates[0]);
    }
  }, []);

  const updateCurrentTemplate = (updates: Partial<PopupTemplate>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addElement = (type: ElementType, columnId: string) => {
    const newElement: PopupElement = {
      id: crypto.randomUUID(),
      type,
      styles: {}
    };

    switch (type) {
      case 'text':
        newElement.content = 'New Text Element';
        newElement.styles = {
          textColor: '#1e293b',
          fontSize: '16px',
          margin: '0 0 16px 0'
        };
        break;
      case 'button':
        newElement.label = 'Button';
        newElement.action = 'close';
        newElement.styles = {
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          borderRadius: '4px',
          padding: '8px 16px',
          width: 'auto'
        };
        break;
      case 'input':
        newElement.inputType = 'text';
        newElement.placeholder = 'Enter text...';
        newElement.styles = {
          borderRadius: '4px',
          borderWidth: '1px',
          borderColor: '#e2e8f0',
          padding: '8px 12px',
          width: '100%'
        };
        break;
      case 'image':
        newElement.imageUrl = 'https://via.placeholder.com/200';
        newElement.alt = 'Placeholder image';
        newElement.styles = {
          width: '100%',
          borderRadius: '4px'
        };
        break;
    }

    setCurrentTemplate(prev => {
      const updatedColumns = prev.layout.columns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            elements: [...column.elements, newElement]
          };
        }
        return column;
      });

      return {
        ...prev,
        layout: {
          ...prev.layout,
          columns: updatedColumns
        }
      };
    });

    setSelectedElementId(newElement.id);

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} element added`,
      variant: "default"
    });
  };

  const addColumn = () => {
    const newColumn: LayoutColumn = {
      id: crypto.randomUUID(),
      ratio: "50%",
      elements: []
    };

    setCurrentTemplate(prev => {
      const currentColumns = [...prev.layout.columns];
      const newColumnCount = currentColumns.length + 1;
      const equalWidth = `${Math.floor(100 / newColumnCount)}%`;

      const updatedColumns = currentColumns.map(col => ({
        ...col,
        ratio: equalWidth
      }));

      updatedColumns.push({
        ...newColumn,
        ratio: equalWidth
      });

      return {
        ...prev,
        layout: {
          ...prev.layout,
          columns: updatedColumns
        }
      };
    });

    toast({
      title: "Column added",
      description: "A new column has been added to the layout",
      variant: "default"
    });
  };

  const updateColumnWidth = (columnId: string, width: string) => {
    setCurrentTemplate(prev => {
      const updatedColumns = prev.layout.columns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            ratio: width
          };
        }
        return column;
      });

      return {
        ...prev,
        layout: {
          ...prev.layout,
          columns: updatedColumns
        }
      };
    });
  };

  const deleteColumn = (columnId: string) => {
    setCurrentTemplate(prev => {
      // Only allow deletion if there's more than one column
      if (prev.layout.columns.length <= 1) {
        toast({
          title: "Cannot delete column",
          description: "You must have at least one column in the layout",
          variant: "destructive"
        });
        return prev;
      }

      // Get elements from the column being deleted
      const columnToDelete = prev.layout.columns.find(col => col.id === columnId);
      if (!columnToDelete) return prev;

      // If selected element is in this column, deselect it
      if (selectedElementId && columnToDelete.elements.some(el => el.id === selectedElementId)) {
        setSelectedElementId(null);
      }

      // Remove the column
      const filteredColumns = prev.layout.columns.filter(col => col.id !== columnId);

      // Redistribute widths
      const equalWidth = `${Math.floor(100 / filteredColumns.length)}%`;
      const updatedColumns = filteredColumns.map(col => ({
        ...col,
        ratio: equalWidth
      }));

      return {
        ...prev,
        layout: {
          ...prev.layout,
          columns: updatedColumns
        }
      };
    });

    toast({
      title: "Column deleted",
      variant: "default"
    });
  };

  // Update an existing element
  const updateElement = (elementId: string, updates: Partial<PopupElement>) => {
    setCurrentTemplate(prev => {
      const updatedColumns = prev.layout.columns.map(column => {
        const elementIndex = column.elements.findIndex(el => el.id === elementId);

        if (elementIndex >= 0) {
          const updatedElements = [...column.elements];
          updatedElements[elementIndex] = {
            ...updatedElements[elementIndex],
            ...updates
          };

          return {
            ...column,
            elements: updatedElements
          };
        }

        return column;
      });

      return {
        ...prev,
        layout: {
          ...prev.layout,
          columns: updatedColumns
        }
      };
    });
  };

  // Delete an element
  const deleteElement = (elementId: string) => {
    setCurrentTemplate(prev => {
      const updatedColumns = prev.layout.columns.map(column => {
        return {
          ...column,
          elements: column.elements.filter(el => el.id !== elementId)
        };
      });

      return {
        ...prev,
        layout: {
          ...prev.layout,
          columns: updatedColumns
        }
      };
    });

    // If the deleted element was selected, clear selection
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }

    toast({
      title: "Element deleted",
      variant: "default"
    });
  };

  // Select an element for editing
  const selectElement = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };

  // Save the current template
  const saveCurrentTemplate = () => {
    saveTemplate(currentTemplate);

    // Update templates list
    setTemplates(prev => {
      const existingIndex = prev.findIndex(t => t.id === currentTemplate.id);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = currentTemplate;
        return updated;
      } else {
        return [...prev, currentTemplate];
      }
    });

    toast({
      title: "Template saved",
      description: `"${currentTemplate.name}" has been saved`,
      variant: "default"
    });
  };

  // Create a new template
  const createTemplate = () => {
    const newTemplate = {
      ...defaultPopupTemplate,
      id: crypto.randomUUID(),
      name: `Template ${templates.length + 1}`
    };

    setCurrentTemplate(newTemplate);
    setTemplates(prev => [...prev, newTemplate]);
    setSelectedElementId(null);

    toast({
      title: "New template created",
      variant: "default"
    });
  };

  // Load a template by ID
  const loadTemplate = (id: string) => {
    const template = getTemplateById(id);

    if (template) {
      setCurrentTemplate(template);
      setSelectedElementId(null);

      toast({
        title: "Template loaded",
        description: `"${template.name}" has been loaded`,
        variant: "default"
      });
    } else {
      toast({
        title: "Error",
        description: "Template not found",
        variant: "destructive"
      });
    }
  };

  // Remove a template
  const removeTemplate = (id: string) => {
    deleteTemplate(id);
    setTemplates(prev => prev.filter(t => t.id !== id));

    // If removing current template, load a different one
    if (currentTemplate.id === id) {
      const remainingTemplates = templates.filter(t => t.id !== id);

      if (remainingTemplates.length > 0) {
        setCurrentTemplate(remainingTemplates[0]);
      } else {
        // Create a new template if no others exist
        createTemplate();
      }
    }

    toast({
      title: "Template deleted",
      variant: "default"
    });
  };

  // Clone a template
  const cloneTemplate = (id: string) => {
    const cloned = duplicateTemplate(id);

    if (cloned) {
      setTemplates(prev => [...prev, cloned]);
      setCurrentTemplate(cloned);
      setSelectedElementId(null);

      toast({
        title: "Template duplicated",
        description: `"${cloned.name}" created`,
        variant: "default"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive"
      });
    }
  };

  // Toggle preview visibility
  const togglePreview = () => {
    setIsPreviewVisible(prev => !prev);
  };

  // Toggle code view
  const toggleCodeView = () => {
    setIsCodeVisible(prev => !prev);
  };

  const value = {
    templates,
    currentTemplate,
    isPreviewVisible,
    isCodeVisible,
    selectedElementId,
    setCurrentTemplate,
    updateCurrentTemplate,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    saveCurrentTemplate,
    createTemplate,
    loadTemplate,
    removeTemplate,
    cloneTemplate,
    togglePreview,
    toggleCodeView,
    addColumn,
    updateColumnWidth,
    deleteColumn
  };

  return (
    <PopupContext.Provider value={value}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);

  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }

  return context;
};
