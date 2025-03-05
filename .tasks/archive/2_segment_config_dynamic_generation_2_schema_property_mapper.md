---
id: 20250305-143500
title: Create schema property to UI control mapper
status: completed
date_created: 2025-03-05
date_modified: 2025-03-05
date_completed: 2025-03-05
priority: 2
parentTaskId: 20250305-142500
tags: [schema, ui-components, mapping]
---

# Create schema property to UI control mapper

## Description

We need a system to map JSON schema property definitions to appropriate UI controls. This mapping will allow us to generate form fields dynamically based on the schema.

## Tasks

- [x] Create a utility to map schema property types to UI controls
- [x] Support basic property types (string, number, boolean, array, object)
- [x] Support format constraints (e.g., color, date, uri)
- [x] Support enumeration values with select/dropdown controls
- [x] Add support for nested objects and arrays
- [x] Handle references within the schema

## Acceptance Criteria

- [x] All schema property types have appropriate UI controls
- [x] Enum properties are rendered as dropdowns
- [x] Boolean properties are rendered as switches or checkboxes
- [x] String properties with format constraints have appropriate specialized inputs
- [x] Nested objects are rendered with appropriate grouping
- [x] Arrays can be added/removed/reordered

## Implementation Details

The property mapper should:

1. Analyze the property type from the schema
2. Determine the appropriate UI control (TextField, Select, Switch, etc.)
3. Extract validation rules (min/max, pattern, required)
4. Handle special formats (color, date, email, uri, etc.)
5. Create a configuration object that can be used to render the control

## Implementation Notes

Created the following components:

1. `SchemaControlMapper.ts` - A utility class that maps JSON schema properties to UI control definitions:
   - Maps schema types to PropertyType enum
   - Handles references, nested objects, and arrays
   - Applies special formats (color, icon, email, uri, etc.)
   - Extracts validation rules

2. `SchemaControlFactory.tsx` - A React component that renders UI controls based on schema property definitions:
   - Renders different UI controls based on property type
   - Handles nested objects with collapsible sections
   - Supports arrays with add/remove/reorder functionality
   - Displays validation errors

3. `PropertyMapperTester.tsx` - A test utility to demonstrate and test the mapper:
   - Allows editing test schema JSON
   - Shows generated controls and mapped definitions
   - Displays current property values

## Parent Task

This is a subtask of [Refactor segment components to use dynamic schema generation](20250305-142500).
