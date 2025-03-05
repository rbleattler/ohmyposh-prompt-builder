import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  TextField,
  Divider
} from '@mui/material';
import { BlockConfig } from '../../types/BlockConfig';

interface BlockEditorProps {
  block: BlockConfig;
  onChange: (updatedBlock: BlockConfig) => void;
}

/**
 * Component for editing block properties
 */
const BlockEditor: React.FC<BlockEditorProps> = ({ block, onChange }) => {
  // Handler for alignment change
  const handleAlignmentChange = (event: any) => {
    onChange({
      ...block,
      alignment: event.target.value
    });
  };

  // Handler for newline toggle
  const handleNewlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...block,
      newline: event.target.checked
    });
  };

  // Handler for height change
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value !== '' ? Number(event.target.value) : 1;
    onChange({
      ...block,
      height: value
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Block Settings</Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Alignment</InputLabel>
            <Select
              value={block.alignment || 'left'}
              label="Alignment"
              onChange={handleAlignmentChange}
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="right">Right</MenuItem>
              <MenuItem value="newline">New Line</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={!!block.newline}
                onChange={handleNewlineChange}
              />
            }
            label="Add newline after block"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Block Height"
            type="number"
            size="small"
            value={block.height || 1}
            onChange={handleHeightChange}
            InputProps={{
              inputProps: { min: 1 }
            }}
            helperText="Height factor for the block"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" gutterBottom>Segments in this Block</Typography>
      <Typography variant="body2" color="textSecondary">
        Use the Segments panel to add, edit, and reorder segments within this block.
      </Typography>
    </Box>
  );
};

export default BlockEditor;
