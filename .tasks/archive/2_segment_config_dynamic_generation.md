---
id: 20250305-142500
title: Refactor segment components to use dynamic schema generation
status: completed
date_created: 2025-03-05
date_modified: 2025-03-05
date_completed: 2025-03-05
priority: 2
tags: [schema, segments, dynamic-generation]
subtasks: []
---

# Refactor segment components to use dynamic schema generation

## Description

Currently, the application has hardcoded segment component files in `src/components/segments`, but we're now generating segment types dynamically from the schema. We should refactor our approach to use these dynamically generated types to create a more maintainable system where segment components are built from the schema definitions rather than being hardcoded.

## Tasks

- [x] Remove hardcoded segment components in `src/components/segments` folder
- [x] Create a dynamic segment component factory that reads from generated types
- [x] Refactor `SegmentConfigFactory` to use the generated segment types exclusively
- [x] Create a unified property configuration system based on schema properties
- [x] Update `VisualBuilder` to work with the dynamic segment components
- [x] Add unit tests to verify dynamic segment creation

## Acceptance Criteria

- [x] All segment components are generated dynamically from the schema
- [x] SegmentConfigFactory uses only schema-derived types
- [x] No hardcoded segment properties in the codebase
- [x] Any new segment type added to the schema is automatically supported in the UI without code changes
- [x] The application handles schema changes gracefully

## Implementation Details

Our current approach requires adding a new component file whenever a new segment type is added to the schema, which is not maintainable. Instead, we should:

1. Use the generated `segmentTypes.ts` to identify all available segment types
2. Create a factory that dynamically generates UI components based on segment type
3. Read segment properties from the schema to generate form controls automatically
4. Store definitions for UI controls in a structured format that's driven by the schema
5. Add a cache layer to prevent regenerating components unnecessarily

This approach will make our application automatically adapt to schema changes without requiring manual updates to the codebase.

## Implementation Notes

The refactoring was completed by creating the following components:

1. **Schema to UI Mapping System:**
   - `SchemaControlMapper.ts` - Maps JSON schema properties to UI control definitions
   - `SchemaControlFactory.tsx` - Renders UI controls based on property definitions
   - `PropertyMapperTester.tsx` - Test utility to demonstrate schema mapping

2. **Dynamic Segment Components:**
   - `DynamicSegmentFactory.tsx` - Renders segment visualizations dynamically
   - `DynamicSegmentConfigFactory.tsx` - Generates configuration forms dynamically

3. **Performance Optimizations:**
   - `SchemaCache.ts` - Singleton cache to prevent unnecessary regeneration
   - `SchemaBasedSegmentFactory.tsx` - Uses schema + cache for segment rendering
   - `SchemaBasedConfigFactory.tsx` - Uses schema + cache for config form rendering

4. **Integration with Existing Code:**
   - `SegmentFactoryWrapper.tsx` - Bridges old and new systems
   - Updated `SegmentFactory.tsx` and `SegmentConfigFactory.tsx` to use wrappers

5. **Testing:**
   - `DynamicSegmentFactory.test.tsx` - Tests for segment visualization
   - `SchemaControlMapper.test.ts` - Tests for schema to UI control mapping

The refactored architecture now automatically adapts to schema changes, meaning that when new segment types are added to the schema, they will be supported in the UI without requiring code changes.

## References

- [Schema-driven UI development](https://blog.bitsrc.io/schema-based-form-generation-the-future-of-dynamic-forms-f6672b65892e)
- [JsonSchema form generation](https://github.com/rjsf-team/react-jsonschema-form)

## Additional Notes

This refactoring significantly improves maintainability by eliminating the need to create a new component file for each segment type. The application now dynamically generates UI components based on the schema, making it resilient to schema changes.
