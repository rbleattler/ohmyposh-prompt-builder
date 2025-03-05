import React, { useRef } from 'react';
import {
  Box,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useDrag, useDrop } from 'react-dnd';
import { BlockConfig } from '../../types/BlockConfig';

interface DraggableBlockItemProps {
  block: BlockConfig;
  index: number;
  selectedIndex: number;
  onSelectBlock: (index: number) => void;
  onDeleteBlock: (index: number) => void;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = 'BLOCK_ITEM';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

/**
 * Draggable block item component for use in BlockList
 */
const DraggableBlockItem: React.FC<DraggableBlockItemProps> = ({
  block,
  index,
  selectedIndex,
  onSelectBlock,
  onDeleteBlock,
  moveBlock
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedIndex === index;

  // Helper to get the icon for the block alignment
  const getAlignmentIcon = (alignment?: string) => {
    switch (alignment) {
      case 'right':
        return <AlignHorizontalRightIcon fontSize="small" />;
      case 'newline':
        return <KeyboardReturnIcon fontSize="small" />;
      default:
        return <AlignHorizontalLeftIcon fontSize="small" />;
    }
  };

  // Helper to get the text description for block alignment
  const getAlignmentText = (alignment?: string) => {
    switch (alignment) {
      case 'right':
        return 'Right aligned';
      case 'newline':
        return 'New line';
      default:
        return 'Left aligned';
    }
  };

  // Helper to truncate segment count display
  const getSegmentsText = (count: number) => {
    return `${count} segment${count !== 1 ? 's' : ''}`;
  };

  // Configure drag
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemType,
    item: () => ({
      index,
      id: `block-${index}`,
      type: ItemType
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // Configure drop
  const [, drop] = useDrop<DragItem>({
    accept: ItemType,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

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
      moveBlock(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for performance reasons
      item.index = hoverIndex;
    }
  });

  // Connect the drag and drop refs
  const opacity = isDragging ? 0.4 : 1;
  dragPreview(drop(ref));

  return (
    <ListItem
      ref={ref}
      button
      selected={isSelected}
      onClick={() => onSelectBlock(index)}
      sx={{
        borderLeft: '3px solid',
        borderLeftColor: isSelected ? 'primary.main' : 'transparent',
        mb: 1,
        bgcolor: isSelected ? 'action.selected' : 'background.paper',
        borderRadius: 1,
        transition: 'all 0.2s',
        opacity,
        '&:hover': {
          bgcolor: 'action.hover',
        }
      }}
    >
      {/* Drag handle */}
      <div ref={drag} style={{ cursor: 'move', marginRight: 8, display: 'flex', alignItems: 'center' }}>
        <DragHandleIcon fontSize="small" color="action" />
      </div>

      {/* Block alignment icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, color: 'text.secondary' }}>
        <Tooltip title={getAlignmentText(block.alignment)}>
          {getAlignmentIcon(block.alignment)}
        </Tooltip>
      </Box>

      {/* Block info */}
      <ListItemText
        primary={`Block ${index + 1}`}
        secondary={getSegmentsText(block.segments?.length || 0)}
      />

      {/* Action buttons */}
      <ListItemSecondaryAction>
        <Tooltip title="Edit">
          <IconButton
            edge="end"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onSelectBlock(index);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            edge="end"
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBlock(index);
            }}
            sx={{ ml: 1 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default DraggableBlockItem;
