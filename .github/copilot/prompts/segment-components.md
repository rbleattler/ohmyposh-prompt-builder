---
description: Instructions for working with segment components in oh-my-posh builder
when: "src/components/(segments|factories)/"
weight: 20
---
# Segment Component Development

## Overview

Segment components are the building blocks of the oh-my-posh prompt. Each segment represents a specific piece of information in the prompt (e.g., path, git status, time).

## Segment Implementation Guidelines

1. **Use Dynamic Generation**:
   - Segments should be dynamically generated from schema definitions
   - Use the `SchemaPropertyExtractor` to parse JSON schema for properties
   - Utilize the `DynamicSegmentFactory` for UI generation

2. **Component Structure**:
   - Segment components should be pure functional components
   - Props should include:
     - `segment`: The segment configuration object
     - `onChange`: Callback for when segment changes
     - `segmentIndex`: Index of segment in the block
     - `blockIndex`: Index of the parent block

3. **Configuration UI**:
   - Segment configuration UI should be generated dynamically based on the segment type
   - Use appropriate input controls based on property types
   - Group related properties together
   - Apply validation rules from schema

4. **Validation**:
   - Use the `useValidation` hook to access validation functions
   - Display validation errors inline with form fields
   - Prevent invalid configurations

## Example Usage

```tsx
// Example of using SchemaBasedSegmentFactory
<SchemaBasedSegmentFactory
  type={segment.type}
  segmentConfig={segment}
  onChange={handleSegmentChange}
  segmentIndex={segmentIndex}
  blockIndex={blockIndex}
/>
```

## Legacy to Dynamic Migration

We are transitioning from hardcoded segment components to dynamically generated ones:

1. Use `SegmentEditorWrapper` for compatibility with existing code
2. Gradually replace hardcoded segment types with dynamic generation
3. All new segment types should use the dynamic approach exclusively
