
import React, { useRef, useEffect } from "react";
import { usePopup } from "@/contexts/PopupContext";
import { X } from "lucide-react";
import { PopupPosition, PopupAnimation } from "@/types/popup";

const getPositionStyles = (position: PopupPosition): React.CSSProperties => {
  const base: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  switch (position) {
    case 'top-left':
      return { ...base, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '20px' };
    case 'top-center':
      return { ...base, justifyContent: 'center', alignItems: 'flex-start', padding: '20px 0' };
    case 'top-right':
      return { ...base, justifyContent: 'flex-end', alignItems: 'flex-start', padding: '20px' };
    case 'center-left':
      return { ...base, justifyContent: 'flex-start', alignItems: 'center', padding: '0 20px' };
    case 'center':
      return base;
    case 'center-right':
      return { ...base, justifyContent: 'flex-end', alignItems: 'center', padding: '0 20px' };
    case 'bottom-left':
      return { ...base, justifyContent: 'flex-start', alignItems: 'flex-end', padding: '20px' };
    case 'bottom-center':
      return { ...base, justifyContent: 'center', alignItems: 'flex-end', padding: '20px 0' };
    case 'bottom-right':
      return { ...base, justifyContent: 'flex-end', alignItems: 'flex-end', padding: '20px' };
    default:
      return base;
  }
};

const getAnimationClass = (animation: PopupAnimation): string => {
  switch (animation) {
    case 'fade-in':
      return 'animate-fade-in';
    case 'scale-in':
      return 'animate-scale-in';
    case 'slide-in-top':
      return 'animate-slide-in-top';
    case 'slide-in-right':
      return 'animate-slide-in-right';
    case 'slide-in-bottom':
      return 'animate-slide-in-bottom';
    case 'slide-in-left':
      return 'animate-slide-in-left';
    default:
      return '';
  }
};

// Helper function to apply alignment based on element type and alignment value
const getAlignmentStyles = (element: any): React.CSSProperties => {
  const alignment = element.styles.alignment;
  if (!alignment) return {};

  const styles: React.CSSProperties = {};

  // For text elements, use textAlign
  if (element.type === 'text') {
    styles.textAlign = alignment;
  }
  // For other elements, use flexbox to align the content
  else {
    styles.display = 'flex';
    styles.flexDirection = 'column';

    switch (alignment) {
      case 'left':
        styles.alignItems = 'flex-start';
        break;
      case 'center':
        styles.alignItems = 'center';
        break;
      case 'right':
        styles.alignItems = 'flex-end';
        break;
    }
  }

  return styles;
};

const LivePreview: React.FC = () => {
  const {
    currentTemplate,
    selectElement,
    selectedElementId
  } = usePopup();

  const {
    popupStyles,
    overlayStyles,
    closeButton,
    layout,
    animation
  } = currentTemplate;

  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside elements to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        overlayRef.current.contains(e.target as Node) &&
        (e.target as HTMLElement).classList.contains('preview-overlay')
      ) {
        selectElement(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectElement]);

  const handleElementClick = (
    e: React.MouseEvent<Element>,
    elementId: string
  ) => {
    e.stopPropagation();
    selectElement(elementId);
  };

  const renderElement = (element: any, idx: number) => {
    const isSelected = selectedElementId === element.id;

    // Combine base styles with alignment styles
    const elementStyles: React.CSSProperties = {
      color: element.styles.textColor,
      backgroundColor: element.styles.backgroundColor,
      borderRadius: element.styles.borderRadius,
      margin: element.styles.margin,
      padding: element.styles.padding,
      fontSize: element.styles.fontSize,
      width: element.styles.width,
      height: element.styles.height,
      borderColor: element.styles.borderColor,
      borderWidth: element.styles.borderWidth,
      outline: isSelected ? '2px solid hsl(var(--primary))' : 'none',
      outlineOffset: isSelected ? '2px' : 'none',
      cursor: 'pointer',
      transition: 'outline 0.2s ease, transform 0.2s ease',
      ...getAlignmentStyles(element)
    };

    const elementClass = `preview-element preview-${element.type} ${isSelected ? 'selected' : ''}`;

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            className={elementClass}
            style={elementStyles}
            onClick={(e) => handleElementClick(e, element.id)}
          >
            {element.content}
          </div>
        );

      case 'button':
        // Create a wrapper div for buttons to handle alignment
        return (
          <div
            key={element.id}
            className={`${elementClass}-wrapper`}
            style={getAlignmentStyles(element)}
          >
            <button
              className={elementClass}
              style={{
                ...elementStyles,
                display: 'block',
                alignItems: undefined, // Remove alignment styles that were copied
              }}
              onClick={(e) => handleElementClick(e, element.id)}
            >
              {element.label}
            </button>
          </div>
        );

      case 'input':
        // Create a wrapper div for inputs to handle alignment
        return (
          <div
            key={element.id}
            className={`${elementClass}-wrapper`}
            style={getAlignmentStyles(element)}
          >
            {element.inputType === 'textarea' ? (
              <textarea
                className={elementClass}
                style={{
                  ...elementStyles,
                  display: 'block', // Override the display from alignment styles
                  alignItems: undefined, // Remove alignment styles that were copied
                }}
                placeholder={element.placeholder}
                onClick={(e) => handleElementClick(e, element.id)}
              />
            ) : (
              <input
                type={element.inputType}
                className={elementClass}
                style={{
                  ...elementStyles,
                  display: 'block', // Override the display from alignment styles
                  alignItems: undefined, // Remove alignment styles that were copied
                }}
                placeholder={element.placeholder}
                onClick={(e) => handleElementClick(e, element.id)}
              />
            )}
          </div>
        );

      case 'image':
        // Create a wrapper div for images to handle alignment
        return (
          <div
            key={element.id}
            className={`${elementClass}-wrapper`}
            style={getAlignmentStyles(element)}
          >
            <div
              className={`${elementClass} relative`}
              style={{
                ...elementStyles,
                display: 'block', // Override the display from alignment styles
                alignItems: undefined, // Remove alignment styles that were copied
              }}
              onClick={(e) => handleElementClick(e, element.id)}
            >
              <img
                src={element.imageUrl || 'https://via.placeholder.com/200'}
                alt={element.alt || 'Preview image'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Setup popup container styles
  const popupContainerStyles: React.CSSProperties = {
    backgroundColor: popupStyles.background,
    border: popupStyles.border,
    borderRadius: popupStyles.borderRadius,
    padding: popupStyles.padding,
    boxShadow: popupStyles.boxShadow,
    width: popupStyles.width,
    height: popupStyles.height,
    maxWidth: '90%',
    maxHeight: '90vh',
    position: 'relative',
    overflowY: 'auto'
  };

  // Setup overlay styles
  const previewOverlayStyles: React.CSSProperties = {
    ...getPositionStyles(popupStyles.position),
    backgroundColor: overlayStyles.background,
    opacity: parseFloat(overlayStyles.opacity || '1')
  };

  // Handle case where layout structure is invalid
  if (!layout.rows || !Array.isArray(layout.rows) || layout.rows.length === 0) {
    return (
      <div
        ref={overlayRef}
        className="preview-overlay w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900"
        style={previewOverlayStyles}
      >
        <div
          className={`preview-popup ${getAnimationClass(animation)}`}
          style={popupContainerStyles}
        >
          <div className="preview-content p-4 text-center">
            <p className="text-muted-foreground">
              Layout structure is invalid. Please add rows and columns to your template.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="preview-overlay w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900"
      style={previewOverlayStyles}
    >
      <div
        className={`preview-popup ${getAnimationClass(animation)}`}
        style={popupContainerStyles}
      >
        {closeButton.enabled && closeButton.position === 'inside' && (
          <button
            className="preview-close-button absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
            style={{
              color: closeButton.styles.textColor,
              fontSize: closeButton.styles.fontSize,
              padding: closeButton.styles.padding,
              margin: closeButton.styles.margin
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <X size={16} />
          </button>
        )}

        <div className="preview-content flex flex-col">
          {layout.rows.map((row) => (
            <div
              key={row.id}
              className="preview-row flex"
              style={{
                height: row.height || 'auto',
                width: '100%',
              }}
            >
              {row.columns && row.columns.map((column) => (
                <div
                  key={column.id}
                  className="preview-column"
                  style={{
                    width: column.ratio,
                    padding: '0 8px',
                    boxSizing: 'border-box'
                  }}
                >
                  {column.elements && column.elements.map((element, idx) => renderElement(element, idx))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {closeButton.enabled && closeButton.position === 'outside' && (
        <button
          className="preview-close-button absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          style={{
            color: closeButton.styles.textColor,
            fontSize: closeButton.styles.fontSize,
            padding: closeButton.styles.padding,
            margin: closeButton.styles.margin
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default LivePreview;
