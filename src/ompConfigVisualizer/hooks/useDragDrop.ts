import { useRef } from 'react';
import { XYCoord } from 'react-dnd';

/**
 * Interface for draggable items
 */
export interface DragItem {
  index: number;
  id: string;
  type: string;
}

/**
 * Hook for handling drag and drop functionality
 * Can be used for any draggable component
 */
export const useDragDrop = <T extends DragItem>(
  item: T,
  moveItem: (dragIndex: number, hoverIndex: number) => void
) => {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Determines if the hover is valid for dropping
   */
  const isValidHover = (
    dragIndex: number,
    hoverIndex: number,
    monitor: any,
    hoverBoundingRect: DOMRect
  ) => {
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return false;
    }

    // Determine rectangle on screen
    const clientOffset = monitor.getClientOffset();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Get positions
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
    const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

    // Only perform the move when the mouse has crossed half of the items height/width
    // When dragging downward/rightward, only move when cursor is below/right 50%
    // When dragging upward/leftward, only move when cursor is above/left 50%

    // For vertical dragging
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return false;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return false;
    }

    // For horizontal dragging - uncomment if needed
    /*
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return false;
    }

    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return false;
    }
    */

    return true;
  };

  /**
   * Handle the hover event during drag and drop
   */
  const handleHover = (item: T, monitor: any, hoverIndex: number) => {
    if (!ref.current) {
      return;
    }

    const dragIndex = item.index;

    // Get rectangle on screen
    const hoverBoundingRect = ref.current?.getBoundingClientRect();

    // Check if hover is valid
    if (isValidHover(dragIndex, hoverIndex, monitor, hoverBoundingRect)) {
      // Perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for performance to avoid expensive index searches
      item.index = hoverIndex;
    }
  };

  return {
    ref,
    handleHover
  };
};

export default useDragDrop;