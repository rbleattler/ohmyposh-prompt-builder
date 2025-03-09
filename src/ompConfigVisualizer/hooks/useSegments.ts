import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SegmentType } from '../types/schema/segmentProps';
import { ExtendedBlockConfig } from './useBlocks';

/**
 * Hook for managing segments within a block
 * Handles adding, updating, deleting and reordering segments
 */
export const useSegments = (blockIndex: number) => {
  const { themeConfig, updateTheme } = useTheme();
  const [segments, setSegments] = useState<SegmentType[]>([]);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize segments from the selected block
  useEffect(() => {
    const blocks = themeConfig?.blocks as unknown as ExtendedBlockConfig[] || [];
    const currentBlock = blocks[blockIndex];

    if (currentBlock?.segments) {
      // Make sure segments have the required config property
      const mappedSegments = (currentBlock.segments || []).map(seg => ({
        ...seg,
        config: seg.config || (seg as any).properties || {}  // Use type assertion to avoid TS error
      }));

      setSegments(mappedSegments as SegmentType[]);
    } else {
      setSegments([]);
    }

    // Reset selected segment when block changes
    setSelectedSegmentIndex(null);
  }, [themeConfig, blockIndex]);

  /**
   * Updates the theme with the new segments for the current block
   */
  const updateThemeWithSegments = (updatedSegments: SegmentType[]) => {
    try {
      // Get the current blocks
      const blocks = themeConfig?.blocks ?
        [...themeConfig.blocks] as unknown as ExtendedBlockConfig[] :
        [];

      // Update the segments in the current block
      if (blocks[blockIndex]) {
        blocks[blockIndex] = {
          ...blocks[blockIndex],
          segments: updatedSegments
        };

        // Update the segments state
        setSegments(updatedSegments);

        // Update the theme context
        updateTheme({
          ...themeConfig,
          blocks: blocks
        });
      }
    } catch (err) {
      setError(`Failed to update theme: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  /**
   * Adds a segment to the current block
   */
  const addSegment = (segment: SegmentType) => {
    try {
      const updatedSegments = [...segments, segment];
      updateThemeWithSegments(updatedSegments);

      // Select the new segment
      setSelectedSegmentIndex(updatedSegments.length - 1);
      return updatedSegments.length - 1;
    } catch (err) {
      setError(`Failed to add segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return -1;
    }
  };

  /**
   * Deletes a segment from the current block
   */
  const deleteSegment = (index: number) => {
    try {
      const updatedSegments = segments.filter((_, i) => i !== index);
      updateThemeWithSegments(updatedSegments);

      // Update selected segment index
      if (selectedSegmentIndex === index) {
        setSelectedSegmentIndex(null);
      } else if (selectedSegmentIndex !== null && selectedSegmentIndex > index) {
        setSelectedSegmentIndex(selectedSegmentIndex - 1);
      }

      return true;
    } catch (err) {
      setError(`Failed to delete segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Updates a segment in the current block
   */
  const updateSegment = (index: number, updatedSegment: SegmentType) => {
    try {
      const updatedSegments = [...segments];
      updatedSegments[index] = updatedSegment;

      updateThemeWithSegments(updatedSegments);
      return true;
    } catch (err) {
      setError(`Failed to update segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Moves a segment from one position to another within the current block
   */
  const moveSegment = (dragIndex: number, hoverIndex: number) => {
    try {
      const updatedSegments = [...segments];
      const draggedSegment = updatedSegments[dragIndex];

      // Remove the dragged item
      updatedSegments.splice(dragIndex, 1);
      // Insert it at the new position
      updatedSegments.splice(hoverIndex, 0, draggedSegment);

      // Update selected segment index if needed
      if (selectedSegmentIndex === dragIndex) {
        setSelectedSegmentIndex(hoverIndex);
      }

      updateThemeWithSegments(updatedSegments);
      return true;
    } catch (err) {
      setError(`Failed to move segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Sets the currently selected segment
   */
  const selectSegment = (index: number | null) => {
    if (index === null || (index >= 0 && index < segments.length)) {
      setSelectedSegmentIndex(index);
      return true;
    }
    return false;
  };

  return {
    segments,
    selectedSegmentIndex,
    error,
    clearError: () => setError(null),
    addSegment,
    deleteSegment,
    updateSegment,
    moveSegment,
    selectSegment
  };
};

export default useSegments;