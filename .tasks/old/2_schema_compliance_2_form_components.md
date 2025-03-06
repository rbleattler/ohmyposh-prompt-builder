---
status: todo
completion_date: null
taskId: "20231116-120300"
parentTaskId: "20231116-120000"
---

# Form Components Update

## Description

Update the existing form components for blocks and segments to use the schema-generated types and reflect the schema's constraints, such as required fields, valid values, and default values. This ensures that the UI accurately represents what's possible in oh-my-posh themes.

## Acceptance Criteria

- [ ] Update BlockEditor component to use schema-generated types
- [ ] Update SegmentConfigFactory to use schema-generated types for all segment types
- [ ] Add form fields for all properties defined in the schema
- [ ] Set appropriate default values based on the schema
- [ ] Implement constraints based on schema definitions (min/max values, regex patterns, etc.)
- [ ] Add tooltips with descriptions from the schema for each form field
- [ ] Update segment type selection to only show types defined in the schema
- [ ] Create or update specialized editors for complex segment types
- [ ] Ensure backwards compatibility with existing configurations
- [ ] Add schema-based auto-completion for appropriate fields

## Implementation Notes

This task involves significant updates to the UI components. We should create a set of base form components that can be generated from schema definitions and then use these to rebuild parts of the existing editors.

The implementation should include:

1. Schema-aware form field components that automatically handle validation and constraints
2. Updates to the BlockEditor to use the schema-generated types
3. Updates to the SegmentConfigFactory to handle all segment types defined in the schema
4. Integration with the validation system to show field-specific errors
5. Schema-based tooltips and help text

For complex segment types like git, path, and command, we may need specialized editors that handle their unique properties and constraints. We should ensure that all form elements accurately reflect the schema's definitions while maintaining a good user experience.
