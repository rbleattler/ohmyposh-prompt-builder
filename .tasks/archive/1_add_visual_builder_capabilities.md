---
task_name: "Add Visual Builder Capabilities"
priority: 1
status: "completed"
completion_date: "2023-11-14"
assignee: ""
tags: ["ui", "feature", "drag-and-drop", "color-picker"]
---

# Add Visual Builder Capabilities

## User Story

As a user who is not familiar with JSON configuration, I want to visually build and customize my oh-my-posh prompt so that I can create attractive prompts without directly editing JSON.

## Description

Currently, the application allows editing the JSON configuration directly. This task involves creating visual UI components for building and customizing prompts without directly editing JSON. This will make the tool more accessible to users who are not comfortable with JSON.

## Acceptance Criteria

- [x] Create UI components for editing blocks and segments
  - [x] Design and implement block editor component
  - [x] Design and implement segment editor component
  - [x] Create forms for editing block and segment properties
  - [x] Implement validation for all form inputs
- [x] Add drag-and-drop functionality for rearranging segments
  - [x] Implement drag handlers for blocks and segments
  - [x] Create visual indicators for drag operations
  - [x] Ensure proper updating of the JSON model after drag operations
- [x] Add color picker for selecting colors
  - [x] Implement color picker component
  - [x] Support hex, RGB, and named color formats
  - [x] Add preview of selected colors
  - [x] Include a palette of oh-my-posh recommended colors

## Implementation Details

- Use a UI component library that supports drag-and-drop functionality
- Consider using a color picker library with accessibility features
- Implement a two-way binding between visual components and the JSON model
- Ensure that visual changes immediately update the preview

### Block Editor Component

- Create a UI component for editing blocks
- Allow users to add, remove, and reorder blocks
- Provide forms for editing block properties such as type, style, and content
- Validate inputs to ensure they conform to oh-my-posh specifications

### Segment Editor Component

- Create a UI component for editing segments within blocks
- Allow users to add, remove, and reorder segments within a block
- Provide forms for editing segment properties such as type, style, and content
- Validate inputs to ensure they conform to oh-my-posh specifications

### Drag-and-Drop Functionality

- Implement drag-and-drop handlers for blocks and segments
- Provide visual feedback during drag operations
- Update the JSON model to reflect changes in the order of blocks and segments

### Color Picker Component

- Implement a color picker component for selecting colors
- Support multiple color formats (hex, RGB, named colors)
- Provide a preview of the selected color
- Include a palette of recommended colors for oh-my-posh themes

## Dependencies

- Current JSON editor implementation
- Theme preview rendering engine

## Notes

Focus on creating an intuitive UI that makes it easy for users to understand the relationship between blocks and segments in oh-my-posh.
