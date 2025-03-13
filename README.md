# Popup Builder

A customizable popup creator for web applications with a visual editor and code export functionality.

![Popup Builder Screenshot](https://via.placeholder.com/800x450?text=Popup+Builder+Screenshot)

## Features

- **Visual Editor**: Create popups with a drag-and-drop interface
- **Customizable Elements**: Add text, buttons, inputs, and images
- **Layout Control**: Flexible layout system with rows and columns
- **Styling Options**: Customize colors, sizes, borders, and more
- **Animation Effects**: Choose from various entrance animations
- **Multiple Templates**: Create and save different popup designs
- **Code Export**: Generate ready-to-use HTML/CSS/JS code
- **Live Preview**: See changes in real-time
- **Dark/Light Mode**: Switch between themes

## Getting Started

### 1. Create a New Template

1. Click the "New Template" button in the dropdown menu
2. Give your template a name
3. Start customizing in the editor

### 2. Customize Your Layout

#### Adding Rows and Columns

1. Go to the "Layout" tab in the sidebar
2. Use predefined column layouts (e.g., 50-50, 70-30, 33-33-33)
3. Click "Add Row" to insert a new row
4. Adjust column widths as needed

Available predefined layouts:
- Full Width (100%)
- Two Equal (50% - 50%)
- Three Equal (33.33% - 33.33% - 33.33%)
- Four Equal (25% - 25% - 25% - 25%)
- Wide Left (70% - 30%)
- Wide Right (30% - 70%)
- One-Third Left (33.33% - 66.67%)
- One-Third Right (66.67% - 33.33%)
- Center Focus (25% - 50% - 25%)
- Strong Center (20% - 60% - 20%)

#### Managing Columns
- Add columns to any row
- Delete columns (minimum one column per row)
- Resize columns by adjusting their width percentages

### 3. Add Elements

1. Go to the "Library" tab in the sidebar
2. Choose an element type:
   - **Text**: Headings, paragraphs, or any text content
   - **Button**: Call-to-action buttons with custom actions
   - **Input**: Form fields for collecting user data
   - **Image**: Add images to your popup
3. Drag or click to add the element to your layout

### 4. Customize Elements

1. Click on any element to select it
2. Go to the "Element" tab to see customization options
3. Modify properties like:
   - Text content and formatting
   - Colors and background
   - Sizes and dimensions
   - Borders and spacing
   - Input placeholders and types
   - Button actions and labels

### 5. General Settings

In the "General" tab, you can customize:

- Popup position on the screen
- Overlay appearance
- Animation effects
- Close button behavior
- Trigger conditions (on page load, after delay, on click)

### 6. Export Your Popup

1. Click the "Export Code" button in the header
2. The generated code will be copied to your clipboard
3. Paste the code into your website

## Popup Settings Reference

### Popup Positions
- Top Left
- Top Center
- Top Right
- Center Left
- Center
- Center Right
- Bottom Left
- Bottom Center
- Bottom Right

### Animation Types
- Fade In
- Scale In
- Slide In (from top, right, bottom, or left)
- None

### Trigger Types
- On Load: Display when the page loads
- On Delay: Display after a specified time delay
- On Click: Display when a specific element is clicked

### Element Settings

#### Text Elements
- Content
- Font size
- Font weight
- Text color
- Alignment
- Margins

#### Button Elements
- Label
- Action type (close, link, submit, custom)
- Target URL (for link actions)
- Background color
- Text color
- Border radius
- Padding
- Width

#### Input Elements
- Type (text, email, number, password, textarea)
- Placeholder
- Required status
- Border style
- Border radius
- Padding
- Width

#### Image Elements
- Image URL
- Alt text
- Width
- Border radius

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save current template

## Tips and Best Practices

1. **Start with a template**: Use one of the default templates as a starting point
2. **Keep it simple**: Focus on one clear call-to-action
3. **Use consistent styling**: Maintain consistent colors and styling
4. **Test on different devices**: Ensure your popup looks good on mobile and desktop
5. **Use animations wisely**: Subtle animations look more professional
6. **Consider timing**: Set appropriate delays for popups

## Troubleshooting

**Issue**: Elements are not displaying correctly in the preview.  
**Solution**: Check if all required fields are filled out in the element settings.

**Issue**: Can't add new rows or columns.  
**Solution**: Make sure you're in the Layout tab of the sidebar.

**Issue**: Export code doesn't work as expected.  
**Solution**: Verify all elements have valid properties. Replace image URLs with actual hosted images.

## Implementation Details

The Popup Builder is built with:
- React
- TypeScript
- Tailwind CSS
- Shadcn UI components

The application uses a context-based state management system to handle all popup configurations and modifications.

### Data Structure

Popups are represented by a TypeScript object with the following structure:

```typescript
interface PopupTemplate {
  id: string;
  name: string;
  popupStyles: PopupStyles; // Position, size, etc.
  overlayStyles: OverlayStyles; // Background, opacity
  layout: PopupLayout; // Rows and columns structure
  closeButton: CloseButton; // Close button configuration
  trigger: PopupTrigger; // When to show the popup
  animation: PopupAnimation; // How the popup appears
}
```

The layout uses a nested structure of rows and columns:

```typescript
interface PopupLayout {
  rows: LayoutRow[];
}

interface LayoutRow {
  id: string;
  height?: string;
  columns: LayoutColumn[];
}

interface LayoutColumn {
  id: string;
  ratio: string; // Width percentage
  elements: PopupElement[];
}
```

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
