import React from 'react';
import { Paper, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { SEGMENT_TYPES } from '../../generated/segmentTypes';

interface SegmentSelectorProps {
  onSelect: (segmentType: string) => void;
}

/**
 * Component to select segment types
 * Uses auto-generated segment types from the schema
 */
const SegmentSelector: React.FC<SegmentSelectorProps> = ({ onSelect }) => {
  return (
    <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>Select Segment Type</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose a segment type to add to your prompt
      </Typography>

      <List sx={{ width: '100%' }}>
        {SEGMENT_TYPES.map((segment) => (
          <ListItem
            key={segment.type}
            disableGutters
            disablePadding
          >
            <ListItemButton
              onClick={() => onSelect(segment.type)}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  color: 'primary.contrastText'
                }
              }}
            >
              <ListItemIcon>
                {segment.icon}
              </ListItemIcon>
              <ListItemText
                primary={segment.name}
                secondary={segment.description}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SegmentSelector;
