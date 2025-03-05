import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

interface BlockSelectorProps {
  onSelect: (blockType: any) => void;
}

/**
 * Component to select block types
 */
const BlockSelector: React.FC<BlockSelectorProps> = ({ onSelect }) => {
  // Define block types
  const blockTypes = [
    {
      type: 'prompt',
      name: 'Prompt',
      description: 'Standard prompt block with segments',
      alignment: 'left',
      segments: []
    },
    {
      type: 'rprompt',
      name: 'Right Prompt',
      description: 'Prompt displayed on the right side',
      alignment: 'right',
      segments: []
    },
    {
      type: 'newline',
      name: 'New Line',
      description: 'Starts a new line in the prompt',
      newline: true,
      segments: []
    }
  ];

  return (
    <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>Select Block Type</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose a block type to add to your prompt
      </Typography>

      <List sx={{ width: '100%' }}>
        {blockTypes.map((block) => (
          <ListItem
            key={block.type}
            disableGutters
            disablePadding
          >
            <ListItemButton
              onClick={() => onSelect(block)}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  color: 'primary.contrastText'
                }
              }}
            >
              <ListItemText
                primary={block.name}
                secondary={block.description}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BlockSelector;
