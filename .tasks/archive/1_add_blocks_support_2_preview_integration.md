---
status: done
completion_date: "2023-11-15"
taskId: "20231115-185100"
parentTaskId: "20231115-184500"
---

# Integrate Block Support with Preview

## Description

Update the VisualBuilder and SegmentPreview components to properly display and manage multiple blocks with different alignments.

## Acceptance Criteria

- [x] Update VisualBuilder to switch between blocks for editing
- [x] Modify SegmentPreview to render multiple blocks with correct positioning
- [x] Handle different block alignments (left, right, newline) in the preview
- [x] Ensure preview updates when blocks are added, removed, or reordered
- [x] Maintain backward compatibility with themes having a single block

## Implementation Notes

I've implemented comprehensive preview support for multiple blocks with different alignments:

1. Enhanced `SegmentPreview.tsx` to:
   - Handle block alignments properly (left, right, center)
   - Support the newline property
   - Improve styling for different block types

2. Created `BlockPreview.tsx` to:
   - Render multiple blocks with proper spacing and layout
   - Provide visual indicators for newline blocks
   - Support block selection for editing
   - Include visual feedback when hovering/selecting blocks

3. Added `CommandPreview.tsx` to:
   - Create a more realistic terminal simulation
   - Show prompts in context with simulated commands
   - Include a blinking cursor effect for realism

4. Updated `VisualBuilder.tsx` to:
   - Toggle between simple block view and terminal simulation view
   - Properly update the preview when blocks are modified
   - Navigate to block editing when clicking on blocks

These changes provide a much more realistic preview that accurately represents how the prompt will look in a real terminal. The implementation maintains backward compatibility by handling both single-block and multi-block themes correctly.
