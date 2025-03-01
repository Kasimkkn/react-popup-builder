
import { PopupTemplate, PopupElement, ButtonAction } from "@/types/popup";

/**
 * Generate CSS for popup elements
 */
const generateElementCSS = (element: PopupElement, elementId: string): string => {
  const styles = element.styles || {};
  
  let css = `#${elementId} {`;
  
  if (styles.borderColor) css += `border-color: ${styles.borderColor};`;
  if (styles.borderWidth) css += `border-width: ${styles.borderWidth};`;
  if (styles.backgroundColor) css += `background-color: ${styles.backgroundColor};`;
  if (styles.textColor) css += `color: ${styles.textColor};`;
  if (styles.borderRadius) css += `border-radius: ${styles.borderRadius};`;
  if (styles.margin) css += `margin: ${styles.margin};`;
  if (styles.padding) css += `padding: ${styles.padding};`;
  if (styles.fontSize) css += `font-size: ${styles.fontSize};`;
  if (styles.height) css += `height: ${styles.height};`;
  if (styles.width) css += `width: ${styles.width};`;
  
  // Add alignment styles based on element type
  if (styles.alignment) {
    if (element.type === 'text') {
      css += `text-align: ${styles.alignment};`;
    }
  }
  
  if (styles.customCSS) css += styles.customCSS;
  
  css += `}\n`;
  
  // Add wrapper styles for non-text elements that need alignment
  if (styles.alignment && element.type !== 'text') {
    css += `#${elementId}-wrapper {`;
    css += `display: flex; flex-direction: column;`;
    
    switch (styles.alignment) {
      case 'left':
        css += `align-items: flex-start;`;
        break;
      case 'center':
        css += `align-items: center;`;
        break;
      case 'right':
        css += `align-items: flex-end;`;
        break;
    }
    
    css += `}\n`;
  }
  
  return css;
};

/**
 * Generate CSS for popup container
 */
const generatePopupCSS = (template: PopupTemplate): string => {
  const { popupStyles, overlayStyles } = template;
  
  let css = `
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${overlayStyles.background || 'rgba(0, 0, 0, 0.5)'};
  opacity: ${overlayStyles.opacity || '1'};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-container {
  background: ${popupStyles.background || '#ffffff'};
  border: ${popupStyles.border || 'none'};
  border-radius: ${popupStyles.borderRadius || '0'};
  padding: ${popupStyles.padding || '20px'};
  width: ${popupStyles.width || 'auto'};
  height: ${popupStyles.height || 'auto'};
  box-shadow: ${popupStyles.boxShadow || 'none'};
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.popup-content {
  display: flex;
  flex-wrap: wrap;
}

.popup-column {
  padding: 0 8px;
  box-sizing: border-box;
}\n`;

  // Position CSS
  switch (popupStyles.position) {
    case 'top-left':
      css += `.popup-overlay { justify-content: flex-start; align-items: flex-start; }
.popup-container { margin: 20px; }\n`;
      break;
    case 'top-center':
      css += `.popup-overlay { justify-content: center; align-items: flex-start; }
.popup-container { margin-top: 20px; }\n`;
      break;
    case 'top-right':
      css += `.popup-overlay { justify-content: flex-end; align-items: flex-start; }
.popup-container { margin: 20px; }\n`;
      break;
    case 'center-left':
      css += `.popup-overlay { justify-content: flex-start; align-items: center; }
.popup-container { margin-left: 20px; }\n`;
      break;
    case 'center':
      // Default is already center
      break;
    case 'center-right':
      css += `.popup-overlay { justify-content: flex-end; align-items: center; }
.popup-container { margin-right: 20px; }\n`;
      break;
    case 'bottom-left':
      css += `.popup-overlay { justify-content: flex-start; align-items: flex-end; }
.popup-container { margin: 20px; }\n`;
      break;
    case 'bottom-center':
      css += `.popup-overlay { justify-content: center; align-items: flex-end; }
.popup-container { margin-bottom: 20px; }\n`;
      break;
    case 'bottom-right':
      css += `.popup-overlay { justify-content: flex-end; align-items: flex-end; }
.popup-container { margin: 20px; }\n`;
      break;
  }

  // Close button CSS
  if (template.closeButton.enabled) {
    const closeStyles = template.closeButton.styles;
    css += `.popup-close-button {
  cursor: pointer;
  position: ${template.closeButton.position === 'inside' ? 'absolute' : 'fixed'};
  top: ${template.closeButton.position === 'inside' ? '10px' : '5px'};
  right: ${template.closeButton.position === 'inside' ? '10px' : '5px'};
  border: none;
  background: transparent;
  font-size: ${closeStyles.fontSize || '24px'};
  color: ${closeStyles.textColor || '#000'};
  padding: ${closeStyles.padding || '5px'};
  margin: ${closeStyles.margin || '0'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}\n`;
  }

  // Animation CSS
  switch (template.animation) {
    case 'fade-in':
      css += `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.popup-container {
  animation: fadeIn 0.3s ease-out;
}\n`;
      break;
    case 'scale-in':
      css += `@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.popup-container {
  animation: scaleIn 0.3s ease-out;
}\n`;
      break;
    case 'slide-in-top':
      css += `@keyframes slideInTop {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}
.popup-container {
  animation: slideInTop 0.3s ease-out;
}\n`;
      break;
    case 'slide-in-right':
      css += `@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.popup-container {
  animation: slideInRight 0.3s ease-out;
}\n`;
      break;
    case 'slide-in-bottom':
      css += `@keyframes slideInBottom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.popup-container {
  animation: slideInBottom 0.3s ease-out;
}\n`;
      break;
    case 'slide-in-left':
      css += `@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.popup-container {
  animation: slideInLeft 0.3s ease-out;
}\n`;
      break;
  }

  return css;
};

/**
 * Generate HTML for popup elements
 */
const generateElementHTML = (element: PopupElement): string => {
  const elementId = `el_${element.id.split('-')[0]}`;
  let html = '';
  
  // Determine if we need a wrapper for alignment
  const needsWrapper = element.type !== 'text' && element.styles.alignment;
  
  // Start wrapper if needed
  if (needsWrapper) {
    html = `<div id="${elementId}-wrapper" class="popup-element-wrapper">\n  `;
  }
  
  switch (element.type) {
    case 'text':
      html += `<div id="${elementId}" class="popup-element popup-text">${element.content || ''}</div>`;
      break;
    
    case 'button':
      const action = element.action || 'close';
      let actionAttr = '';
      
      switch (action as ButtonAction) {
        case 'close':
          actionAttr = 'onclick="closePopup()"';
          break;
        case 'link':
          if (element.actionUrl) {
            actionAttr = `onclick="window.open('${element.actionUrl}', '_blank')"`;
          }
          break;
        case 'submit':
          actionAttr = 'type="submit"';
          break;
        case 'custom':
          actionAttr = 'onclick="customButtonAction()"';
          break;
      }
      
      html += `<button id="${elementId}" class="popup-element popup-button" ${actionAttr}>${element.label || 'Button'}</button>`;
      break;
    
    case 'input':
      const inputType = element.inputType || 'text';
      const required = element.required ? 'required' : '';
      
      if (inputType === 'textarea') {
        html += `<textarea id="${elementId}" class="popup-element popup-input" placeholder="${element.placeholder || ''}" ${required}></textarea>`;
      } else {
        html += `<input id="${elementId}" class="popup-element popup-input" type="${inputType}" placeholder="${element.placeholder || ''}" ${required}>`;
      }
      break;
    
    case 'image':
      html += `<img id="${elementId}" class="popup-element popup-image" src="${element.imageUrl || ''}" alt="${element.alt || ''}">`;
      break;
  }
  
  // Close wrapper if needed
  if (needsWrapper) {
    html += '\n</div>';
  }
  
  return html;
};

/**
 * Generate complete HTML with embedded CSS and JS for a popup
 */
export const generatePopupCode = (template: PopupTemplate): string => {
  let css = '<style>\n';
  css += generatePopupCSS(template);
  
  // Generate CSS for all elements
  template.layout.columns.forEach(column => {
    column.elements.forEach(element => {
      const elementId = `el_${element.id.split('-')[0]}`;
      css += generateElementCSS(element, elementId);
    });
  });
  
  css += '</style>\n';
  
  // Generate HTML
  let html = `<div id="popup-overlay" class="popup-overlay">
  <div id="popup-container" class="popup-container">\n`;
  
  // Close button
  if (template.closeButton.enabled && template.closeButton.position === 'inside') {
    html += '    <button class="popup-close-button" onclick="closePopup()">×</button>\n';
  }
  
  // Layout with columns
  html += '    <div class="popup-content">\n';
  
  template.layout.columns.forEach(column => {
    const columnStyle = `width: ${column.ratio}`;
    html += `      <div class="popup-column" style="${columnStyle}">\n`;
    
    column.elements.forEach(element => {
      html += `        ${generateElementHTML(element).replace(/\n/g, '\n        ')}\n`;
    });
    
    html += '      </div>\n';
  });
  
  html += '    </div>\n';
  html += '  </div>\n';
  
  // Outside close button
  if (template.closeButton.enabled && template.closeButton.position === 'outside') {
    html += '  <button class="popup-close-button" onclick="closePopup()">×</button>\n';
  }
  
  html += '</div>\n';
  
  // JavaScript
  let js = `<script>
  // Function to close the popup
  function closePopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    if (popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  }
  
  // Function for custom button action (placeholder)
  function customButtonAction() {
    console.log('Custom button clicked');
    // Replace with your custom functionality
  }
  
  // Function to show the popup
  function showPopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    if (popupOverlay) {
      popupOverlay.style.display = 'flex';
    }
  }
  
  // Initialize popup based on trigger
  function initPopup() {
    // Popup trigger configuration
    const triggerType = "${template.trigger.type}";
    
    switch (triggerType) {
      case 'onLoad':
        showPopup();
        break;
        
      case 'onDelay':
        const delay = ${parseInt(template.trigger.delay || "0") * 1000};
        setTimeout(showPopup, delay);
        break;
        
      case 'onClick':
        const triggerElement = document.getElementById("${template.trigger.elementId || ""}");
        if (triggerElement) {
          triggerElement.addEventListener('click', showPopup);
        } else {
          console.error('Trigger element not found');
        }
        break;
    }
    
    // Close popup when clicking on overlay (optional)
    const popupOverlay = document.getElementById('popup-overlay');
    const popupContainer = document.getElementById('popup-container');
    
    if (popupOverlay && popupContainer) {
      popupOverlay.addEventListener('click', function(event) {
        if (event.target === popupOverlay) {
          closePopup();
        }
      });
    }
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', initPopup);
</script>`;

  // Combine all code
  return `${css}${html}${js}`;
};
