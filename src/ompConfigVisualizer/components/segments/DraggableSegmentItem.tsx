import React, { useRef } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useDrag, useDrop } from 'react-dnd';
import { SegmentType } from '../../types/schema/segmentProps';

export interface DraggableSegmentItemProps {
  segment: SegmentType;
  index: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  moveSegment: (dragIndex: number, hoverIndex: number) => void;
}

/**
 * A component that displays a segment item in a list with selection capability.
 * Will be enhanced with drag and drop functionality in the future.
 */
const DraggableSegmentItem: React.FC<DraggableSegmentItemProps> = ({
  segment,
  index,
  selectedIndex,
  onSelect,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(index);
  };

  return (
    <Box
      sx={{
        p: 1,
        mb: 1,
        bgcolor: selectedIndex === index ? 'primary.dark' : 'background.paper',
        borderRadius: 1,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onClick={() => onSelect(index)}
    >
      <Typography>{segment.type} Segment</Typography>
      <IconButton size="small" onClick={handleDelete} edge="end">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default DraggableSegmentItem;
