---
status: done
completion_date: "2023-11-15"
priority: 1
taskId: "20231115-184500"
subtasks: ["20231115-185000", "20231115-185030", "20231115-185100"]
---

# Add Blocks Support to Visual Editor

## User Story

As a user of the oh-my-posh prompt builder, I want to be able to create, edit, and delete prompt blocks through the visual editor so that I can build more complex prompt layouts without manually editing JSON.

## Description

Oh-my-posh prompt themes can contain multiple blocks, each potentially positioned differently (left-aligned, right-aligned, or in the newline). The current implementation only supports editing segments within a single block. This task aims to add full support for creating and managing multiple blocks through the visual interface.

## Acceptance Criteria

- [x] Add a "Blocks" section to the visual editor UI that shows all current blocks
- [x] Add ability to create a new block
- [x] Add ability to delete an existing block
- [x] Add ability to reorder blocks through drag and drop
- [x] Add ability to select block type/alignment (left, right, newline)
- [x] Add ability to select a block for editing its segments
- [x] Update the prompt preview to accurately display all blocks with proper positioning
- [x] Ensure all block operations update the underlying theme configuration correctly
- [x] Add proper validation to prevent invalid block configurations

## Technical Details

- Create a new BlockList component to display and manage blocks
- Add a BlockEditor component for configuring block properties
- Extend the VisualBuilder component to switch between blocks
- Update the SegmentPreview component to handle multiple blocks with different alignments
- Ensure backwards compatibility with themes that have a single block
- Add drag and drop support for reordering blocks similar to segments

## Dependencies

- Existing VisualBuilder component
- SegmentPreview component
- ThemeContext for state management
- React DnD for drag and drop functionality

## Subtasks

1. [Create Block Components](/d:/Repos/oh-my-posh-profile-builder/.tasks/archive/1_add_blocks_support_0_block_components.md) - Implement the core components for block management ✓
2. [Implement Block Drag and Drop](/d:/Repos/oh-my-posh-profile-builder/.tasks/archive/1_add_blocks_support_1_drag_drop.md) - Add reordering capability for blocks ✓
3. [Integrate Block Support with Preview](/d:/Repos/oh-my-posh-profile-builder/.tasks/archive/1_add_blocks_support_2_preview_integration.md) - Update the preview to handle multiple blocks ✓

## Notes

This enhancement significantly improves the usability of the visual builder by allowing users to create complex, multi-line prompts with mixed alignments, which is a common pattern in oh-my-posh themes. The implementation includes full drag-and-drop support for reordering blocks, a rich preview system that accurately represents real terminal behavior, and robust editing capabilities for block properties.
