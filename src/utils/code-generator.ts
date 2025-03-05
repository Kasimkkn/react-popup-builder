import { PopupTemplate, PopupElement, ButtonAction, LayoutRow, LayoutColumn } from "@/types/popup";

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
  flex-direction: column;
}

.popup-row {
  display: flex;
  width: 100%;
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

const convertImageUrlForExport = async (imageUrl: string): Promise<string> => {
  if (!imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  try {

    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error('Error converting blob URL:', error);
    return 'https://via.placeholder.com/200';
  }
};

const generateElementHTML = async (element: PopupElement): Promise<string> => {
  if (!element) return '';

  const elementId = `el_${element.id.split('-')[0]}`;
  let html = '';

  // Determine if we need a wrapper for alignment
  const needsWrapper = element.type !== 'text' && element.styles && element.styles.alignment;

  // Start wrapper if needed
  if (needsWrapper) {
    html = `<div id="${elementId}-wrapper" class="popup-element-wrapper">\n  `;
  }

  switch (element.type) {
    // ... other cases remain the same ...

    case 'image':
      // Handle image URL for export
      let imageUrl = element.imageUrl || '';

      try {
        imageUrl = await convertImageUrlForExport(imageUrl);
      } catch (error) {
        console.error('Error converting image URL:', error);
        imageUrl = 'https://via.placeholder.com/200';
      }

      html += `<img id="${elementId}" class="popup-element popup-image" src="${imageUrl}" alt="${element.alt || ''}">`;
      break;
  }

  // Close wrapper if needed
  if (needsWrapper) {
    html += '\n</div>';
  }

  return html;
};

// Option 2: Modify generateRowHTML and generateColumnHTML to be async
const generateColumnHTML = async (column: LayoutColumn): Promise<string> => {
  if (!column) return '';

  const columnStyle = `width: ${column.ratio || '100%'}`;
  let html = `<div class="popup-column" style="${columnStyle}">\n`;

  if (column.elements && Array.isArray(column.elements)) {
    // Use Promise.all to handle async element generation
    const elementHTMLs = await Promise.all(
      column.elements.map(async element => {
        const elementHTML = await generateElementHTML(element);
        return `  ${elementHTML.replace(/\n/g, '\n  ')}\n`;
      })
    );
    html += elementHTMLs.join('');
  }

  html += '</div>';
  return html;
};

const generateRowHTML = async (row: LayoutRow): Promise<string> => {
  if (!row) return '';

  const rowStyle = row.height ? `height: ${row.height};` : '';
  let html = `<div class="popup-row" style="${rowStyle}">\n`;

  if (row.columns && Array.isArray(row.columns)) {
    // Use Promise.all to handle async column generation
    const columnHTMLs = await Promise.all(
      row.columns.map(async column => {
        const columnHTML = await generateColumnHTML(column);
        return `  ${columnHTML.replace(/\n/g, '\n  ')}\n`;
      })
    );
    html += columnHTMLs.join('');
  }

  html += '</div>';
  return html;
};

export const generatePopupCode = async (template: PopupTemplate): Promise<string> => {
  if (!template.layout.rows || !Array.isArray(template.layout.rows) || template.layout.rows.length === 0) {
    return `<div>Invalid popup layout structure</div>`;
  }

  let css = '<style>\n';
  css += generatePopupCSS(template);

  template.layout.rows.forEach(row => {
    if (row && row.columns) {
      row.columns.forEach(column => {
        if (column && column.elements) {
          column.elements.forEach(element => {
            if (element) {
              const elementId = `el_${element.id.split('-')[0]}`;
              css += generateElementCSS(element, elementId);
            }
          });
        }
      });
    }
  });

  css += '</style>\n';

  // Generate HTML
  let html = `<div id="popup-overlay" class="popup-overlay">
  <div id="popup-container" class="popup-container">\n`;

  // Close button
  if (template.closeButton.enabled && template.closeButton.position === 'inside') {
    html += '    <button class="popup-close-button" onclick="closePopup()">×</button>\n';
  }

  // Layout with rows and columns
  html += '    <div class="popup-content">\n';

  // Use await for async row generation
  const rowsHTML = await Promise.all(
    template.layout.rows.map(async row => {
      if (row) {
        return `      ${(await generateRowHTML(row)).replace(/\n/g, '\n      ')}\n`;
      }
      return '';
    })
  );
  html += rowsHTML.join('');

  html += '    </div>\n';
  html += '  </div>\n';

  // Outside close button
  if (template.closeButton.enabled && template.closeButton.position === 'outside') {
    html += '  <button class="popup-close-button" onclick="closePopup()">×</button>\n';
  }

  html += '</div>\n';

  // JavaScript remains the same
  const js = `<script>
  // ... (previous script code remains unchanged)
  </script>`;

  // Combine all code
  return `${css}${html}${js}`;
};
