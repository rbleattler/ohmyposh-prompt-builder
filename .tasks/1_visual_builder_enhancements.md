---
id: 20230516-142530
title: Enhance Visual Builder UI and Functionality
status: todo
priority: 1
assignee:
tags:
  - ui
  - ux
  - editor
---

# Enhance Visual Builder UI and Functionality

## Overview

The Visual Builder component currently has several usability issues that need to be addressed:

1. Segment editing functionality is not working
2. Drag and drop reorganization of segments no longer works
3. Block and segment properties are not visible or editable
4. The tab-based navigation between blocks and segments is not intuitive

## Acceptance Criteria

- [ ] Implement segment editing functionality
  - [ ] Create proper SegmentEditor component that shows all configurable properties
  - [ ] Ensure changes to segment properties are reflected in the preview

- [ ] Restore drag and drop functionality for segments
  - [ ] Implement proper drag handling for segments
  - [ ] Visual indicators should show where the segment will be placed
  - [ ] Update segment order in the theme when reordering

- [ ] Show and make properties editable for both blocks and segments
  - [ ] Display all relevant properties based on the selected block/segment type
  - [ ] Use appropriate input controls for different property types (text, color, boolean, etc.)
  - [ ] Changes should be validated and immediately reflected in the preview

- [ ] Improve UI navigation flow
  - [ ] When selecting a block, automatically show its segments in the same view
  - [ ] Implement a hierarchical view where segments are shown as children of their parent block
  - [ ] Remove tab-based navigation in favor of a more intuitive nested approach

## Technical Details

### Required Changes

1. Refactor `VisualBuilder.tsx` to use a hierarchical component structure
2. Implement proper drag and drop functionality using React DnD or a similar library
3. Create or update the SegmentEditor component to handle all segment types
4. Build dynamic form controls for editing properties based on segment/block type
5. Update the UI layout to show blocks and their segments in a single, intuitive view

### Dependencies

- Existing segment and block type definitions
- Theme context for updating the theme configuration
- Validation context for property validation

## Subtasks

This task is substantial and should be broken down into smaller subtasks:

1. UI Layout Restructuring
2. Segment Editor Implementation
3. Drag and Drop Functionality
4. Dynamic Property Controls

## Time Estimate

8-16 hours

## References

- [React DnD Documentation](https://react-dnd.github.io/react-dnd/about)
- Original intended behavior screenshots (attach if available)
