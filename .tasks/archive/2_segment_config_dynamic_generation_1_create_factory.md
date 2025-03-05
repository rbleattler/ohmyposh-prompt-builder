---
id: 20250305-143000
title: Create dynamic segment component factory
status: done
date_created: 2025-03-05
date_modified: 2025-03-05
priority: 1
parentTaskId: 20250305-142500
tags: [schema, segments, factory-pattern]
---

# Create dynamic segment component factory

## Description

To replace the hardcoded segment components, we need to create a factory that can generate segment configuration forms dynamically based on the schema. This subtask focuses on creating that factory component.

## Tasks

- [x] Create a new `DynamicSegmentFactory` component that reads from generated schema
- [x] Add support for mapping schema property types to appropriate UI controls
- [x] Implement a system to handle common property patterns across segment types
- [x] Add support for segment-specific property groups
- [x] Create utilities to extract default values from schema
- [x] Add validation integration

## Acceptance Criteria

- [x] The factory can generate configuration forms for any segment type defined in the schema
- [x] Generated forms respect property types (string, boolean, number, etc.)
- [x] Forms include proper validation constraints from the schema
- [x] Default values are correctly applied from schema definitions
- [x] The factory handles property dependencies correctly (some properties may show/hide based on others)

## Implementation Details

The segment factory should:

1. Read the segment type definition from the generated types - ✓ Done
2. Extract properties for that segment type from the schema - ✓ Done
3. Map each property to an appropriate UI control based on its type - ✓ Done
4. Apply validation rules based on schema constraints - ✓ Done
5. Handle special cases like enums, patterns, and format validations - ✓ Done

## Parent Task

This is a subtask of [Refactor segment components to use dynamic schema generation](20250305-142500).

## Progress Notes

The implementation includes:

1. `DynamicSegmentFactory.tsx` - Core factory component that generates UI based on segment type
2. `ControlFactory.tsx` - Generates UI controls based on property types
3. `SchemaPropertyExtractor.ts` - Utility to extract property definitions from JSON Schema
4. `IconPicker.tsx` - Special control for picking Nerd Font icons
5. `PropertyGroupRenderer.tsx` - Component to render property groups
6. `SchemaBasedSegmentFactory.tsx` - Wrapper that handles schema loading/caching
7. `SchemaCache.ts` - Utility for caching schema data
8. `SegmentEditorWrapper.tsx` - Compatibility layer for transitioning from old to new system

All key requirements have been implemented, and the factory can now generate UI controls dynamically from the schema.
