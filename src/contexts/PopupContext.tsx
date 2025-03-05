import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  PopupTemplate,
  PopupElement,
  ElementType,
  defaultPopupTemplate,
  LayoutColumn,
  LayoutRow,
  createDefaultLayout,
  predefinedColumnLayouts
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
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTemplate: (template: PopupTemplate) => void;
  updateCurrentTemplate: (updates: Partial<PopupTemplate>) => void;
  addElement: (type: ElementType, rowId: string, columnId: string) => void;
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
  addRow: () => void;
  addColumn: (rowId?: string) => void;
  updateColumnWidth: (rowId: string, columnId: string, width: string) => void;
  deleteColumn: (rowId: string, columnId: string) => void;
  updateRowHeight: (rowId: string, height: string) => void;
  addRowWithLayout: (layoutId: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<PopupTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<PopupTemplate>(defaultPopupTemplate);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const validateAndUpdateTemplate = (template: PopupTemplate): PopupTemplate => {
    let needsUpdate = false;
    const updatedTemplate = { ...template };

    if (!updatedTemplate.layout.rows || !Array.isArray(updatedTemplate.layout.rows) || updatedTemplate.layout.rows.length === 0) {
      updatedTemplate.layout = createDefaultLayout();
      needsUpdate = true;
      console.log("Created default layout for invalid template");
    } else {
      const validRows = updatedTemplate.layout.rows.map(row => {
        if (!row.columns || !Array.isArray(row.columns) || row.columns.length === 0) {
          return {
            ...row,
            height: row.height || "auto",
            columns: [{
              id: crypto.randomUUID(),
              ratio: "100%",
              elements: []
            }]
          };
        }

        const validColumns = row.columns.map(column => {
          if (!column.elements || !Array.isArray(column.elements)) {
            return {
              ...column,
              elements: []
            };
          }
          return column;
        });

        return {
          ...row,
          height: row.height || "auto",
          columns: validColumns
        };
      });

      if (JSON.stringify(validRows) !== JSON.stringify(updatedTemplate.layout.rows)) {
        updatedTemplate.layout.rows = validRows;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      console.log("Template structure was updated to ensure validity");
      return updatedTemplate;
    }

    return template;
  };

  useEffect(() => {
    const loadedTemplates = getOrCreateTemplates();

    const validatedTemplates = loadedTemplates.map(validateAndUpdateTemplate);
    setTemplates(validatedTemplates);

    if (validatedTemplates.length > 0) {
      setCurrentTemplate(validatedTemplates[0]);
    }
  }, []);

  const updateCurrentTemplate = (updates: Partial<PopupTemplate>) => {
    setCurrentTemplate(prev => {
      const updated = { ...prev, ...updates };
      return validateAndUpdateTemplate(updated);
    });
  };

  const addRow = () => {
    const newRow: LayoutRow = {
      id: crypto.randomUUID(),
      height: "auto",
      columns: [
        {
          id: crypto.randomUUID(),
          ratio: "100%",
          elements: []
        }
      ]
    };

    setCurrentTemplate(prev => {
      const updatedTemplate = {
        ...prev,
        layout: {
          ...prev.layout,
          rows: [...(prev.layout.rows || []), newRow]
        }
      };

      return validateAndUpdateTemplate(updatedTemplate);
    });

    toast({
      title: "Row added",
      description: "A new row has been added to the layout",
      variant: "default"
    });
  };

  const addColumn = (rowId?: string) => {
    const targetRowId = rowId || currentTemplate.layout.rows?.[0]?.id;

    if (!targetRowId) {
      toast({
        title: "Error",
        description: "No row found to add column to",
        variant: "destructive"
      });
      return;
    }

    const newColumn: LayoutColumn = {
      id: crypto.randomUUID(),
      ratio: "50%",
      elements: []
    };

    setCurrentTemplate(prev => {
      const updatedRows = prev.layout.rows?.map(row => {
        if (row.id === targetRowId) {
          const currentColumns = [...row.columns];

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
            ...row,
            columns: updatedColumns
          };
        }
        return row;
      }) || [];

      const updatedTemplate = {
        ...prev,
        layout: {
          ...prev.layout,
          rows: updatedRows
        }
      };

      return validateAndUpdateTemplate(updatedTemplate);
    });

    toast({
      title: "Column added",
      description: "A new column has been added to the row",
      variant: "default"
    });
  };

  const updateColumnWidth = (rowId: string, columnId: string, width: string) => {
    setCurrentTemplate(prev => {
      const updatedRows = prev.layout.rows?.map(row => {
        if (row.id === rowId) {
          const updatedColumns = row.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                ratio: width
              };
            }
            return column;
          });

          return {
            ...row,
            columns: updatedColumns
          };
        }
        return row;
      }) || [];

      const updatedTemplate = {
        ...prev,
        layout: {
          ...prev.layout,
          rows: updatedRows
        }
      };

      return validateAndUpdateTemplate(updatedTemplate);
    });
  };

  const updateRowHeight = (rowId: string, height: string) => {
    setCurrentTemplate(prev => {
      const updatedRows = prev.layout.rows?.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            height
          };
        }
        return row;
      }) || [];

      const updatedTemplate = {
        ...prev,
        layout: {
          ...prev.layout,
          rows: updatedRows
        }
      };

      return validateAndUpdateTemplate(updatedTemplate);
    });
  };

  const deleteColumn = (rowId: string, columnId: string) => {
    setCurrentTemplate(prev => {
      const targetRow = prev.layout.rows?.find(row => row.id === rowId);

      if (!targetRow) {
        toast({
          title: "Error",
          description: "Row not found",
          variant: "destructive"
        });
        return prev;
      }

      if (targetRow.columns.length <= 1) {
        toast({
          title: "Cannot delete column",
          description: "You must have at least one column in the row",
          variant: "destructive"
        });
        return prev;
      }

      const columnToDelete = targetRow.columns.find(col => col.id === columnId);
      if (!columnToDelete) return prev;

      if (selectedElementId && columnToDelete.elements.some(el => el.id === selectedElementId)) {
        setSelectedElementId(null);
      }

      const updatedRows = prev.layout.rows?.map(row => {
        if (row.id === rowId) {
          const filteredColumns = row.columns.filter(col => col.id !== columnId);

          const equalWidth = `${Math.floor(100 / filteredColumns.length)}%`;
          const updatedColumns = filteredColumns.map(col => ({
            ...col,
            ratio: equalWidth
          }));

          return {
            ...row,
            columns: updatedColumns
          };
        }
        return row;
      }) || [];

      const updatedTemplate = {
        ...prev,
        layout: {
          ...prev.layout,
          rows: updatedRows
        }
      };

      return validateAndUpdateTemplate(updatedTemplate);
    });

    toast({
      title: "Column deleted",
      variant: "default"
    });
  };

  const addElement = (type: ElementType, rowId: string, columnId: string) => {
    if (!currentTemplate.layout.rows) {
      console.error("Cannot add element: layout.rows is missing");
      toast({
        title: "Error adding element",
        description: "The layout structure is invalid. Please try recreating the template.",
        variant: "destructive"
      });
      return;
    }

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
      try {
        const rowIndex = prev.layout.rows?.findIndex(r => r.id === rowId) ?? -1;

        if (rowIndex === -1) {
          throw new Error(`Row with ID ${rowId} not found`);
        }

        const row = prev.layout.rows?.[rowIndex];
        if (!row || !row.columns) {
          throw new Error(`Invalid row structure for row ID ${rowId}`);
        }

        const columnIndex = row.columns.findIndex(c => c.id === columnId);
        if (columnIndex === -1) {
          throw new Error(`Column with ID ${columnId} not found in row ${rowId}`);
        }

        const updatedRows = [...(prev.layout.rows || [])];
        const updatedColumns = [...updatedRows[rowIndex].columns];

        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          elements: [...(updatedColumns[columnIndex].elements || []), newElement]
        };

        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          columns: updatedColumns
        };

        const updatedTemplate = {
          ...prev,
          layout: {
            ...prev.layout,
            rows: updatedRows
          }
        };

        return validateAndUpdateTemplate(updatedTemplate);
      } catch (error) {
        console.error("Error adding element:", error);
        return prev;
      }
    });

    setSelectedElementId(newElement.id);

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} element added`,
      variant: "default"
    });
  };

  const updateElement = (elementId: string, updates: Partial<PopupElement>) => {
    if (!elementId || !updates) {
      console.error("Invalid update parameters:", { elementId, updates });
      return;
    }

    setCurrentTemplate(prev => {
      try {
        if (!prev.layout.rows) {
          throw new Error("Invalid layout structure: missing rows array");
        }

        const updatedRows = prev.layout.rows.map(row => {
          if (!row.columns) return row;

          const updatedColumns = row.columns.map(column => {
            if (!column.elements) return column;

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
            ...row,
            columns: updatedColumns
          };
        });

        const updatedTemplate = {
          ...prev,
          layout: {
            ...prev.layout,
            rows: updatedRows
          }
        };

        return validateAndUpdateTemplate(updatedTemplate);
      } catch (error) {
        console.error("Error updating element:", error);
        return prev;
      }
    });
  };

  const deleteElement = (elementId: string) => {
    if (!elementId) {
      console.error("Invalid element ID for deletion");
      return;
    }

    setCurrentTemplate(prev => {
      try {
        if (!prev.layout.rows) {
          throw new Error("Invalid layout structure: missing rows array");
        }

        const updatedRows = prev.layout.rows.map(row => {
          if (!row.columns) return row;

          const updatedColumns = row.columns.map(column => {
            if (!column.elements) return column;

            return {
              ...column,
              elements: column.elements.filter(el => el.id !== elementId)
            };
          });

          return {
            ...row,
            columns: updatedColumns
          };
        });

        const updatedTemplate = {
          ...prev,
          layout: {
            ...prev.layout,
            rows: updatedRows
          }
        };

        return validateAndUpdateTemplate(updatedTemplate);
      } catch (error) {
        console.error("Error deleting element:", error);
        return prev;
      }
    });

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }

    toast({
      title: "Element deleted",
      variant: "default"
    });
  };

  const selectElement = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };

  const saveCurrentTemplate = () => {
    const validatedTemplate = validateAndUpdateTemplate(currentTemplate);
    saveTemplate(validatedTemplate);

    setTemplates(prev => {
      const existingIndex = prev.findIndex(t => t.id === validatedTemplate.id);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = validatedTemplate;
        return updated;
      } else {
        return [...prev, validatedTemplate];
      }
    });

    setCurrentTemplate(validatedTemplate);

    toast({
      title: "Template saved",
      description: `"${validatedTemplate.name}" has been saved`,
      variant: "default"
    });
  };

  const createTemplate = () => {
    const newTemplate = {
      ...defaultPopupTemplate,
      id: crypto.randomUUID(),
      name: `Template ${templates.length + 1}`
    };

    const validatedTemplate = validateAndUpdateTemplate(newTemplate);
    setCurrentTemplate(validatedTemplate);
    setTemplates(prev => [...prev, validatedTemplate]);
    setSelectedElementId(null);

    toast({
      title: "New template created",
      variant: "default"
    });
  };

  const loadTemplate = (id: string) => {
    const template = getTemplateById(id);

    if (template) {
      const validatedTemplate = validateAndUpdateTemplate(template);
      setCurrentTemplate(validatedTemplate);
      setSelectedElementId(null);

      toast({
        title: "Template loaded",
        description: `"${validatedTemplate.name}" has been loaded`,
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

  const removeTemplate = (id: string) => {
    deleteTemplate(id);
    setTemplates(prev => prev.filter(t => t.id !== id));

    if (currentTemplate.id === id) {
      const remainingTemplates = templates.filter(t => t.id !== id);

      if (remainingTemplates.length > 0) {
        setCurrentTemplate(validateAndUpdateTemplate(remainingTemplates[0]));
      } else {
        createTemplate();
      }
    }

    toast({
      title: "Template deleted",
      variant: "default"
    });
  };

  const cloneTemplate = (id: string) => {
    const cloned = duplicateTemplate(id);

    if (cloned) {
      const validatedClone = validateAndUpdateTemplate(cloned);
      setTemplates(prev => [...prev, validatedClone]);
      setCurrentTemplate(validatedClone);
      setSelectedElementId(null);

      toast({
        title: "Template duplicated",
        description: `"${validatedClone.name}" created`,
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

  const togglePreview = () => {
    setIsPreviewVisible(prev => !prev);
  };

  const toggleCodeView = () => {
    setIsCodeVisible(prev => !prev);
  };

  const addRowWithLayout = (layoutId: string) => {
    const selectedLayout = predefinedColumnLayouts.find(layout => layout.id === layoutId);

    if (!selectedLayout) {
      toast({
        title: "Error",
        description: "Layout not found",
        variant: "destructive"
      });
      return;
    }

    const newRow: LayoutRow = {
      id: crypto.randomUUID(),
      height: "auto",
      columns: selectedLayout.columns.map(width => ({
        id: crypto.randomUUID(),
        ratio: width,
        elements: []
      }))
    };

    setCurrentTemplate(prev => {
      const updatedTemplate = {
        ...prev,
        layout: {
          ...prev.layout,
          rows: [...(prev.layout.rows || []), newRow]
        }
      };

      return validateAndUpdateTemplate(updatedTemplate);
    });

    toast({
      title: "Row added",
      description: `A new row with ${selectedLayout.name} layout has been added`,
      variant: "default"
    });
  };

  const value = {
    templates,
    currentTemplate,
    isPreviewVisible,
    isCodeVisible,
    selectedElementId,
    setCurrentTemplate,
    updateCurrentTemplate,
    isLoggedIn,
    setIsLoggedIn,
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
    addRow,
    addColumn,
    updateColumnWidth,
    deleteColumn,
    updateRowHeight,
    addRowWithLayout
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
