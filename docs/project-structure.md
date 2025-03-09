# Project Structure

This document describes the organization of the oh-my-posh-profile-builder project.

## Directory Structure

```
src/
├── components/
│   ├── blocks/
│   ├── common/
│   ├── editor/
│   ├── layout/
│   ├── preview/
│   └── segments/
├── contexts/
├── defaults/
├── dynamicTypeGenerator/
├── factories/
├── fonts/
├── generated/
├── hooks/
├── img/
├── ompConfigVisualizer/
│   ├── components/
│   ├── contexts/
│   ├── defaults/
│   ├── factories/
│   ├── fonts/
│   ├── generated/
│   ├── hooks/
│   ├── img/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   └── utils/
├── schemas/
├── services/
├── types/
│   └── schema/
├── utils/
```

## Components Organization

Components are organized by domain or feature:

- **blocks/** - Components for managing blocks (e.g., BlockList, BlockEditor, BlocksPanel)
- **segments/** - Components for managing segments within blocks (e.g., SegmentEditor, SegmentSelector)
- **editor/** - Core editor components (e.g., VisualBuilder, PropertiesPanel, ColorPicker)
- **common/** - Reusable UI components used across the application (e.g., TabPanel, ModalDialog)
- **preview/** - Components for previewing the prompt (e.g., BlockPreview, CommandPreview)
- **layout/** - Components for managing layout (e.g., EditorLayout)

## Hooks

Custom hooks in the `hooks/` directory extract reusable logic:

- **useBlocks** - Logic for managing blocks (add, update, delete, move)
- **useSegments** - Logic for managing segments within a block
- **useDragDrop** - Reusable drag-and-drop functionality

## Import Conventions

The project uses barrel exports (index.ts files) in each directory to simplify imports:

```tsx
// Instead of:
import BlockEditor from '../components/blocks/BlockEditor';
import BlockList from '../components/blocks/BlockList';

// You can use:
import { BlockEditor, BlockList } from '../components/blocks';
```

## Component Hierarchy

The main component hierarchy is structured as follows:

- `VisualBuilder` (container component)
  - `EditorLayout` (layout manager)
    - `PreviewPanel` (preview display)
    - `BlocksPanel` (block management)
    - `SegmentsPanel` (segment management)
    - `PropertiesPanel` (property editing)

## State Management

State is managed through:

1. Custom hooks for domain logic (e.g., useBlocks, useSegments)
2. React Context for global state (ThemeContext, ValidationContext)
3. Component state for UI-specific state

## Naming Conventions

- Component files use PascalCase (e.g., `BlockEditor.tsx`)
- Hook files use camelCase with 'use' prefix (e.g., `useBlocks.ts`)
- Utility files use camelCase (e.g., `schemaUtils.ts`)
- Type definitions use PascalCase (e.g., `BlockConfig.ts`)