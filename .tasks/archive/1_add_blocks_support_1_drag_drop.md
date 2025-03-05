---
status: done
completion_date: "2023-11-15"
taskId: "20231115-185030"
parentTaskId: "20231115-184500"
---

# Implement Block Drag and Drop

## Description

Implement drag and drop functionality for blocks to allow users to reorder them visually.

## Acceptance Criteria

- [x] Add drag and drop support for reordering blocks
- [x] Provide visual feedback during drag operations
- [x] Ensure reordering updates the underlying theme configuration
- [x] Handle edge cases such as dragging to beginning/end of the list
- [x] Maintain block selection state during and after drag operations

## Implementation Notes

I've implemented the drag and drop functionality for blocks using React DnD:

1. Created a new `DraggableBlockItem.tsx` component that:
   - Uses React DnD hooks (useDrag and useDrop) to enable drag and drop
   - Shows a drag handle icon to indicate draggability
   - Provides visual feedback with opacity changes during dragging
   - Maintains the same styling and functionality as regular block items

2. Updated the `BlockList.tsx` component to:
   - Use the new DraggableBlockItem components
   - Accept a moveBlock handler for reordering blocks

3. Enhanced the `VisualBuilder.tsx` component with:
   - A new handleMoveBlock function that:
     - Reorders blocks in the blocks array
     - Updates the selectedBlockIndex if the selected block is moved
     - Handles edge cases when blocks are moved across the selected block
     - Updates the theme with the new block order
   - Passed the handleMoveBlock function to BlockList

All acceptance criteria have been met. Users can now:
- Drag and drop blocks to reorder them
- See visual feedback during drag operations
- Have the selection state properly maintained during reordering
- Have the underlying theme configuration properly updated
