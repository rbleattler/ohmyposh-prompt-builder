import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BlockConfig } from '../types/BlockConfig';

/**
 * Extended BlockConfig interface that includes powerline properties
 */
export interface ExtendedBlockConfig extends BlockConfig {
  powerline?: boolean;
  powerline_symbol?: string;
  thin_powerline?: boolean;
  index?: number;
}

/**
 * Hook for managing blocks in the theme
 * Handles adding, updating, deleting and reordering blocks
 */
export const useBlocks = () => {
  const { themeConfig, updateTheme } = useTheme();
  const [blocks, setBlocks] = useState<ExtendedBlockConfig[]>([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Initialize blocks from theme config
  useEffect(() => {
    if (themeConfig?.blocks) {
      setBlocks(themeConfig.blocks as unknown as ExtendedBlockConfig[]);

      // If selected block index is out of bounds, reset it
      if (selectedBlockIndex >= themeConfig.blocks.length) {
        setSelectedBlockIndex(Math.max(0, themeConfig.blocks.length - 1));
      }
    } else {
      // Default to a single left-aligned block if none exists
      setBlocks([{ type: "prompt", alignment: 'left', segments: [] }]);
    }
  }, [themeConfig, selectedBlockIndex]);

  /**
   * Updates the theme with new blocks
   */
  const updateThemeWithBlocks = (updatedBlocks: ExtendedBlockConfig[]) => {
    try {
      setBlocks(updatedBlocks);

      // Update theme context
      updateTheme({
        ...themeConfig,
        blocks: updatedBlocks as unknown as BlockConfig[]
      });
    } catch (err) {
      setError(`Failed to update theme: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  /**
   * Adds a new block to the theme
   */
  const addBlock = (blockType: BlockConfig) => {
    try {
      // Create a new block with the selected type
      const newBlock: ExtendedBlockConfig = {
        ...blockType,
        segments: blockType.segments || []
      };

      // Add the new block to the theme
      const updatedBlocks: ExtendedBlockConfig[] = [...blocks, newBlock];
      updateThemeWithBlocks(updatedBlocks);

      // Select the new block
      setSelectedBlockIndex(updatedBlocks.length - 1);

      return updatedBlocks.length - 1; // Return the index of the new block
    } catch (err) {
      setError(`Failed to add block: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return -1;
    }
  };

  /**
   * Deletes a block from the theme
   */
  const deleteBlock = (index: number) => {
    try {
      // Prevent deleting the last block
      if (blocks.length <= 1) {
        setError("Cannot delete the last block. At least one block is required.");
        return false;
      }

      const updatedBlocks = blocks.filter((_, i) => i !== index);
      updateThemeWithBlocks(updatedBlocks);

      // If the deleted block was selected, select the first block
      if (selectedBlockIndex === index) {
        setSelectedBlockIndex(0);
      }
      // If the deleted block was before the selected one, adjust the index
      else if (selectedBlockIndex > index) {
        setSelectedBlockIndex(selectedBlockIndex - 1);
      }

      return true;
    } catch (err) {
      setError(`Failed to delete block: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Updates a block in the theme
   */
  const updateBlock = (index: number, updatedBlock: ExtendedBlockConfig) => {
    try {
      const updatedBlocks = [...blocks];
      updatedBlocks[index] = updatedBlock;

      updateThemeWithBlocks(updatedBlocks);
      return true;
    } catch (err) {
      setError(`Failed to update block: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Moves a block from one position to another
   */
  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    try {
      // Create a copy of the blocks array
      const updatedBlocks = [...blocks];

      // Remove the dragged block
      const [draggedBlock] = updatedBlocks.splice(dragIndex, 1);

      // Insert it at the new position
      updatedBlocks.splice(hoverIndex, 0, draggedBlock);

      updateThemeWithBlocks(updatedBlocks);

      // If the selected block is being moved, update the selected block index
      if (selectedBlockIndex === dragIndex) {
        setSelectedBlockIndex(hoverIndex);
      }
      // Otherwise, if we're moving a block across the selected block, adjust the index
      else if (
        (dragIndex < selectedBlockIndex && hoverIndex >= selectedBlockIndex) ||
        (dragIndex > selectedBlockIndex && hoverIndex <= selectedBlockIndex)
      ) {
        // If dragging from before to after the selected, move selection down
        if (dragIndex < selectedBlockIndex) {
          setSelectedBlockIndex(selectedBlockIndex - 1);
        }
        // If dragging from after to before the selected, move selection up
        else {
          setSelectedBlockIndex(selectedBlockIndex + 1);
        }
      }

      return true;
    } catch (err) {
      setError(`Failed to reorder blocks: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Sets the current selected block index
   */
  const selectBlock = (index: number) => {
    if (index >= 0 && index < blocks.length) {
      setSelectedBlockIndex(index);
      return true;
    }
    return false;
  };

  // Return the blocks state and functions
  return {
    blocks,
    selectedBlockIndex,
    error,
    clearError: () => setError(null),
    addBlock,
    deleteBlock,
    updateBlock,
    moveBlock,
    selectBlock
  };
};

export default useBlocks;