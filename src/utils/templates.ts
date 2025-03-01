
import { PopupTemplate, defaultPopupTemplate } from "@/types/popup";

// LocalStorage key for templates
const TEMPLATES_KEY = 'popup_builder_templates';

/**
 * Retrieves all stored templates from localStorage
 */
export const getTemplates = (): PopupTemplate[] => {
  try {
    const templatesJson = localStorage.getItem(TEMPLATES_KEY);
    if (!templatesJson) return [];
    return JSON.parse(templatesJson);
  } catch (error) {
    console.error('Failed to parse templates from localStorage:', error);
    return [];
  }
};

/**
 * Saves a template to localStorage
 */
export const saveTemplate = (template: PopupTemplate): void => {
  try {
    const templates = getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save template to localStorage:', error);
  }
};

/**
 * Creates a new template with default values and saves it
 */
export const createNewTemplate = (): PopupTemplate => {
  const newTemplate = {
    ...defaultPopupTemplate,
    id: crypto.randomUUID()
  };
  
  saveTemplate(newTemplate);
  return newTemplate;
};

/**
 * Gets a template by ID
 */
export const getTemplateById = (id: string): PopupTemplate | null => {
  const templates = getTemplates();
  const template = templates.find(t => t.id === id);
  return template || null;
};

/**
 * Deletes a template by ID
 */
export const deleteTemplate = (id: string): void => {
  try {
    const templates = getTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filteredTemplates));
  } catch (error) {
    console.error('Failed to delete template:', error);
  }
};

/**
 * Duplicates a template
 */
export const duplicateTemplate = (id: string): PopupTemplate | null => {
  const template = getTemplateById(id);
  if (!template) return null;
  
  const duplicatedTemplate = {
    ...template,
    id: crypto.randomUUID(),
    name: `${template.name} (Copy)`
  };
  
  saveTemplate(duplicatedTemplate);
  return duplicatedTemplate;
};

/**
 * Clears all templates from localStorage
 */
export const clearAllTemplates = (): void => {
  localStorage.removeItem(TEMPLATES_KEY);
};

/**
 * Returns all available templates or creates one if none exist
 */
export const getOrCreateTemplates = (): PopupTemplate[] => {
  const templates = getTemplates();
  if (templates.length === 0) {
    const newTemplate = createNewTemplate();
    return [newTemplate];
  }
  return templates;
};
