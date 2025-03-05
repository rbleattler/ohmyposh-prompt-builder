import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
import { SegmentType } from '../types/SegmentProps';
import SegmentFactory from '../SegmentFactory';

interface DraggableSegmentProps {
  segment: SegmentType;
  index: number;
  moveSegment: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = 'PREVIEW_SEGMENT';

const DraggableSegment: React.FC<DraggableSegmentProps> = ({ segment, index, moveSegment }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Define drop handling with hover for interactive reordering
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Get rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Get mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the item's width
      // Dragging left to right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging right to left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveSegment(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for performance reasons
      item.index = hoverIndex;
    },
  });

  // Define drag behavior
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Connect drag and drop refs
  drag(drop(ref));

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <SegmentFactory
        type={segment.type}
        config={segment.config}
        foreground={segment.foreground}
        background={segment.background}
      />
    </Box>
  );
};

export default DraggableSegment;
