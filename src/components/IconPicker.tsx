import React, { useState } from 'react';
import { Box, TextField, IconButton, Dialog, DialogTitle, DialogContent, Grid, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import CloseIcon from '@mui/icons-material/Close';

// Common Nerd Font icons (just a small subset for demo)
const COMMON_ICONS = [
  { code: '\uf015', name: 'Home' },
  { code: '\uf07b', name: 'Folder' },
  { code: '\uf1c0', name: 'Database' },
  { code: '\uf121', name: 'Code' },
  { code: '\uf1d3', name: 'Git' },
  { code: '\uf17c', name: 'Linux' },
  { code: '\uf179', name: 'Apple' },
  { code: '\uf17a', name: 'Windows' },
  { code: '\uf113', name: 'Github' },
  { code: '\ue798', name: 'Vim' },
  { code: '\ue738', name: 'VS Code' },
  { code: '\ue712', name: 'Docker' },
  { code: '\ue73c', name: 'Terminal' },
  { code: '\uf5ef', name: 'Clock' },
  { code: '\uf187', name: 'Archive' },
  { code: '\uf1e6', name: 'Plug' },
  { code: '\uf021', name: 'Refresh' },
  { code: '\uf0e7', name: 'Lightning' },
  { code: '\uf071', name: 'Warning' },
  { code: '\uf06a', name: 'Info' },
  { code: '\uf058', name: 'Check Circle' },
  { code: '\uf059', name: 'Question Circle' },
  { code: '\uf05a', name: 'Info Circle' },
  { code: '\uf057', name: 'Times Circle' },
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Handle dialog open/close
  const handleClickOpen = () => {
    setOpen(true);
    setSearch('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle icon selection
  const handleSelectIcon = (iconCode: string) => {
    onChange(iconCode);
    handleClose();
  };

  // Filter icons based on search
  const filteredIcons = search
    ? COMMON_ICONS.filter(icon =>
        icon.name.toLowerCase().includes(search.toLowerCase())
      )
    : COMMON_ICONS;

  return (
    <>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter icon unicode or pick one"
        size="small"
        InputProps={{
          startAdornment: value && (
            <InputAdornment position="start">
              <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
                {value}
              </Box>
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton onClick={handleClickOpen}>
              <FormatColorTextIcon />
            </IconButton>
          ),
        }}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Select Icon</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search icons"
            fullWidth
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, height: '400px', overflowY: 'auto' }}>
            <Grid container spacing={1}>
              {filteredIcons.map((icon) => (
                <Grid item xs={2} sm={1} key={icon.code}>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handleSelectIcon(icon.code)}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontFamily: '"Cascadia Code", monospace',
                        fontSize: '1.5rem',
                        mb: 1,
                      }}
                    >
                      {icon.code}
                    </Box>
                    <Typography variant="caption" align="center" noWrap sx={{ width: '100%' }}>
                      {icon.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}

              {filteredIcons.length === 0 && (
                <Grid item xs={12}>
                  <Typography align="center" sx={{ py: 4 }}>
                    No icons found matching "{search}"
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconPicker;
