---
description: Instructions for UI component development in oh-my-posh builder
when: "src/components/.*\\.tsx$"
weight: 25
---
# UI Component Development

## Component Guidelines

1. **Component Structure**:
   - Use functional components with hooks
   - Define prop interfaces with explicit types
   - Use proper component composition
   - Keep components focused and single-purpose

2. **Style Guidelines**:
   - Use Material UI (MUI) for UI components
   - Utilize the theme for consistent styling
   - Use `sx` prop for component-specific styling
   - Respect responsive design principles

3. **State Management**:
   - Use React Context for global state
   - Use local state for component-specific state
   - Avoid prop drilling through multiple components
   - Consider composition over deep component hierarchies

## Form Components

When creating form components:

1. Use controlled components with explicit value/onChange props
2. Include proper validation and error display
3. Group related form fields together
4. Provide clear labels and help text
5. Support keyboard navigation

## Preview Components

For preview components (visualizing the prompt):

1. Accurately represent the final terminal appearance
2. Support different terminal styles and themes
3. Handle special characters and icons appropriately
4. Consider performance optimizations for complex prompts

## Example Component Structure

```tsx
interface MyComponentProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  value,
  onChange,
  label = "Default Label"
}) => {
  // Component implementation
  return (
    // JSX structure
  );
};

export default MyComponent;
```
