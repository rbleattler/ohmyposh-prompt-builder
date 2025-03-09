import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  // This is a simplified color picker for now
  // In a full implementation, we would use a library like react-color
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '4px',
          bgcolor: color,
          border: '1px solid rgba(255,255,255,0.2)',
          mr: 1,
        }}
      />
      <TextField
        size="small"
        value={color}
        onChange={handleColorChange}
        sx={{ flexGrow: 1 }}
        InputProps={{
          endAdornment: (
            <IconButton
              size="small"
              onClick={() => setShowPicker(!showPicker)}
              sx={{ color: color === '#ffffff' ? '#000000' : color }}
            >
              <ColorLensIcon />
            </IconButton>
          )
        }}
      />

      {/* In a full implementation, we would render a color picker popup when showPicker is true */}
    </Box>
  );
};

export default ColorPicker;