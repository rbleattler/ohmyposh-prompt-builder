import React, { useRef } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useDrag, useDrop } from 'react-dnd';
import { SegmentType } from '../../types/schema/segmentProps';

interface DraggableSegmentItemProps {
  segment: SegmentType;
  index: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  moveSegment: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = 'SEGMENT_ITEM';

const DraggableSegmentItem: React.FC<DraggableSegmentItemProps> = ({
  segment,
  index,
  selectedIndex,
  onSelect,
  onDelete,
  moveSegment
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedIndex === index;

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Get mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the item's height
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSegment(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      item.index = hoverIndex;
    },
  });

  // Connect the drag preview to the entire item,
  // but the drag handle to only the drag icon
  dragPreview(drop(ref));

  const getSegmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      git: '#f05033',
      path: '#4caf50',
      os: '#2196f3',
      time: '#9c27b0',
      battery: '#ff9800',
      weather: '#00bcd4',
      spotify: '#1ed760',
      exit: '#f44336',
    };
    return colors[type.toLowerCase()] || '#757575';
  };

  return (
    <Paper
      ref={ref}
      elevation={isSelected ? 3 : 1}
      sx={{
        p: 1,
        mb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        bgcolor: isSelected ? 'primary.light' : 'background.paper',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s ease',
        borderLeft: `4px solid ${getSegmentTypeColor(segment.type)}`
      }}
      onClick={() => onSelect(index)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box ref={drag} sx={{ cursor: 'move', mr: 1, display: 'flex', alignItems: 'center' }}>
          <DragHandleIcon fontSize="small" />
        </Box>
        <Typography variant="body2">
          {segment.type.charAt(0).toUpperCase() + segment.type.slice(1)}
        </Typography>
      </Box>
      <Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default DraggableSegmentItem;
