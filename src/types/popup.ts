
// Define the position options for popups
export type PopupPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

// Define the animation options for popups
export type PopupAnimation =
  | 'fade-in'
  | 'scale-in'
  | 'slide-in-top'
  | 'slide-in-right'
  | 'slide-in-bottom'
  | 'slide-in-left'
  | 'none';

// Define the trigger types for popups
export type TriggerType =
  | 'onLoad'
  | 'onDelay'
  | 'onClick';

// Define the element types available for popups
export type ElementType =
  | 'text'
  | 'button'
  | 'input'
  | 'image';

// Define the input types for form elements
export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'textarea';

// Define the button action types
export type ButtonAction =
  | 'close'
  | 'link'
  | 'submit'
  | 'custom';

// Define the close button position options
export type CloseButtonPosition = 'inside' | 'outside' | 'none';

// Define style properties for elements
export interface ElementStyles {
  borderColor?: string;
  borderWidth?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  margin?: string;
  padding?: string;
  customCSS?: string;
  fontSize?: string;
  alignment?: string;
  height?: string;
  width?: string;
  fontWeight?: string;
}

// Define the structure for a popup element
export interface PopupElement {
  id: string;
  type: ElementType;
  content?: string;
  label?: string;
  action?: ButtonAction;
  actionUrl?: string;
  inputType?: InputType;
  placeholder?: string;
  required?: boolean;
  imageUrl?: string;
  alt?: string;
  styles: ElementStyles;
}

// Define a column in the layout
export interface LayoutColumn {
  id: string;
  ratio: string;
  elements: PopupElement[];
}
export interface LayoutRow {
  id: string;
  columns: LayoutColumn[];
}
// Define the layout structure
export interface PopupLayout {
  rows: number;
  columns: LayoutColumn[];
}

// Define the close button configuration
export interface CloseButton {
  enabled: boolean;
  position: CloseButtonPosition;
  styles: ElementStyles;
}

// Define the trigger configuration
export interface PopupTrigger {
  type: TriggerType;
  delay?: string;
  elementId?: string;
}

// Define the overall popup styling
export interface PopupStyles {
  position: PopupPosition;
  width?: string;
  height?: string;
  background?: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
  boxShadow?: string;
}

// Define the overlay styling
export interface OverlayStyles {
  background?: string;
  opacity?: string;
}

// Define the complete popup template structure
export interface PopupTemplate {
  id: string;
  name: string;
  popupStyles: PopupStyles;
  overlayStyles: OverlayStyles;
  layout: PopupLayout;
  closeButton: CloseButton;
  trigger: PopupTrigger;
  animation: PopupAnimation;
}

// Default values for a new popup template
export const defaultPopupTemplate: PopupTemplate = {
  id: crypto.randomUUID(),
  name: "New Popup",
  popupStyles: {
    position: "center",
    width: "400px",
    height: "auto",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)"
  },
  overlayStyles: {
    background: "rgba(0, 0, 0, 0.5)",
    opacity: "1"
  },
  layout: {
    rows: 1,
    columns: [
      {
        id: crypto.randomUUID(),
        ratio: "100%",
        elements: [
          {
            id: crypto.randomUUID(),
            type: "text",
            content: "Welcome to our website!",
            styles: {
              textColor: "#1e293b",
              fontSize: "18px",
              fontWeight: "600",
              alignment: "center",
              margin: "0 0 16px 0"
            }
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            content: "Subscribe to our newsletter to stay updated.",
            styles: {
              textColor: "#64748b",
              fontSize: "14px",
              alignment: "center",
              margin: "0 0 16px 0"
            }
          },
          {
            id: crypto.randomUUID(),
            type: "button",
            label: "Subscribe",
            action: "close",
            styles: {
              backgroundColor: "hsl(var(--primary))",
              textColor: "#ffffff",
              borderRadius: "4px",
              padding: "8px 16px",
              fontSize: "14px",
              alignment: "center",
              width: "auto"
            }
          }
        ]
      }
    ]
  },
  closeButton: {
    enabled: true,
    position: "inside",
    styles: {
      textColor: "#64748b",
      fontSize: "16px",
      margin: "0",
      padding: "4px"
    }
  },
  trigger: {
    type: "onDelay",
    delay: "3"
  },
  animation: "fade-in"
};
