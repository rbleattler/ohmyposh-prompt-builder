---
id: 20250305-142500
title: Refactor segment components to use dynamic schema generation
status: todo
date_created: 2025-03-05
date_modified: 2025-03-05
priority: 2
tags: [schema, segments, dynamic-generation]
subtasks: []
---

# Refactor segment components to use dynamic schema generation

## Description

Currently, the application has hardcoded segment component files in `src/components/segments`, but we're now generating segment types dynamically from the schema. We should refactor our approach to use these dynamically generated types to create a more maintainable system where segment components are built from the schema definitions rather than being hardcoded.

## Tasks

- [ ] Remove hardcoded segment components in `src/components/segments` folder
- [ ] Create a dynamic segment component factory that reads from generated types
- [ ] Refactor `SegmentConfigFactory` to use the generated segment types exclusively
- [ ] Create a unified property configuration system based on schema properties
- [ ] Update `VisualBuilder` to work with the dynamic segment components
- [ ] Add unit tests to verify dynamic segment creation

## Acceptance Criteria

- All segment components are generated dynamically from the schema
- SegmentConfigFactory uses only schema-derived types
- No hardcoded segment properties in the codebase
- Any new segment type added to the schema is automatically supported in the UI without code changes
- The application handles schema changes gracefully

## Implementation Details

Our current approach requires adding a new component file whenever a new segment type is added to the schema, which is not maintainable. Instead, we should:

1. Use the generated `segmentTypes.ts` to identify all available segment types
2. Create a factory that dynamically generates UI components based on segment type
3. Read segment properties from the schema to generate form controls automatically
4. Store definitions for UI controls in a structured format that's driven by the schema
5. Add a cache layer to prevent regenerating components unnecessarily

This approach will make our application automatically adapt to schema changes without requiring manual updates to the codebase.

## References

- [Schema-driven UI development](https://blog.bitsrc.io/schema-based-form-generation-the-future-of-dynamic-forms-f6672b65892e)
- [JsonSchema form generation](https://github.com/rjsf-team/react-jsonschema-form)

## Additional Notes

This is a significant refactoring that should make the application more maintainable and automatically adaptable to schema changes. It reduces the need for manual updates when segment types are added or modified in the oh-my-posh schema.
