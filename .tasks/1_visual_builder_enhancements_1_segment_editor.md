---
id: 20230516-142731
title: Implement Segment Editor Component
status: todo
priority: 1
parent: 20230516-142530
tags:
  - ui
  - editor
  - segments
---

# Implement Segment Editor Component

## Overview

The current Segment Editor component is a placeholder that does not actually render any editable properties for segments. This task involves creating a fully functional Segment Editor that displays and allows editing of all properties for a selected segment.

## Acceptance Criteria

- [ ] Create a complete SegmentEditor component that:
  - [ ] Displays all configurable properties for the selected segment type
  - [ ] Uses appropriate input controls based on property type
  - [ ] Validates inputs and provides feedback on invalid values
  - [ ] Updates the segment in real-time when properties change

- [ ] Support all segment types with their specific properties
  - [ ] Common properties (style, foreground, background)
  - [ ] Type-specific properties (e.g., path settings for git segments)

- [ ] Ensure changes are properly saved to the theme configuration
  - [ ] Updates should be reflected in the preview immediately
  - [ ] Changes should persist when switching between segments/blocks

## Technical Details

### Implementation Approach

1. Create a dynamic form generator that reads segment schema definitions
2. Map each property type to an appropriate MUI form control
3. Implement property-specific validation rules
4. Use the Theme Context to update the segment properties

### Component Structure

```tsx
const SegmentEditor: React.FC<{
  segment: SegmentType;
  segmentIndex: number;
  blockIndex: number;
  onChange: (updatedSegment: SegmentType) => void;
}> = ({ segment, segmentIndex, blockIndex, onChange }) => {
  // State management for form values
  // Property change handlers
  // Validation logic

  return (
    <Box>
      <Typography variant="h6">Edit {segment.type} Segment</Typography>
      <FormControl fullWidth>
        {/* General properties (style, colors) */}
        {/* Dynamic properties based on segment type */}
        {/* Add property button for array-type properties */}
      </FormControl>
    </Box>
  );
};
```

### Dependencies

- Segment schema definitions
- Material UI form components
- Theme context for updates

## Time Estimate

4-6 hours

## References

- [Material UI Form Components](https://mui.com/components/text-fields/)
- [Oh My Posh Segment Documentation](https://ohmyposh.dev/docs/configuration/segment)
