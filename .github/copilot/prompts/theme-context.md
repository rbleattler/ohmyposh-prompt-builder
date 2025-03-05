---
description: Instructions for working with theme context in oh-my-posh builder
when: "src/contexts/ThemeContext.tsx|.*theme.*"
weight: 30
---
# Theme Context Development

## Overview

The ThemeContext is the central state management solution for oh-my-posh theme configurations. It provides access to the current theme configuration and methods to update it throughout the application.

## Context Structure

The ThemeContext includes:

1. **ThemeConfig**: The current theme configuration
2. **Theme Management Methods**:
   - `updateTheme`: Replace the entire theme configuration
   - `addBlock`: Add a new block to the theme
   - `updateBlock`: Update a specific block
   - `removeBlock`: Remove a block from the theme
   - `addSegment`: Add a segment to a specific block

## Implementation Guidelines

When working with ThemeContext:

1. **Accessing the Context**:
   ```tsx
   const { themeConfig, updateTheme } = useTheme();
   ```

2. **Updating Theme Properties**:
   - Always create a new object when updating (maintain immutability)
   - Update nested properties by creating new objects/arrays at each level
   - Use the provided context methods instead of directly modifying state

3. **Theme Validation**:
   - Changes to the theme should be validated against the schema
   - Use ValidationContext in conjunction with ThemeContext
   - Display validation errors to the user

## Storage

The theme configuration is:
1. Stored in React state during the session
2. Persisted to localStorage when changes occur
3. Loaded from localStorage on application start

## Example Usage

```tsx
// Adding a new segment to a block
const { addSegment } = useTheme();

const handleAddSegment = () => {
  const newSegment = createSegmentConfig('git');
  addSegment(blockIndex, newSegment);
};
```
