import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Collapse, IconButton } from '@mui/material';
import { Error as ErrorIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useValidation } from '../contexts/ValidationContext';

interface ValidationErrorDisplayProps {
  path?: string;
  showTitle?: boolean;
  maxHeight?: string | number;
}

/**
 * Component to display schema validation errors
 * Can show all errors or just errors for a specific path
 */
const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  path = '',
  showTitle = true,
  maxHeight = 300
}) => {
  const { errors, isValid } = useValidation();
  const [expanded, setExpanded] = React.useState(false);

  // Filter errors for the specific path if provided
  const filteredErrors = path
    ? errors.filter(error => error.path === path || error.path.startsWith(`${path}/`))
    : errors;

  if (isValid || filteredErrors.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'error.main',
        borderRadius: 1,
        p: 1,
        mb: 2,
        bgcolor: 'rgba(211, 47, 47, 0.04)'
      }}
    >
      {showTitle && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="error" variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon fontSize="small" />
            {filteredErrors.length} validation {filteredErrors.length === 1 ? 'error' : 'errors'} found
          </Typography>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse errors" : "Expand errors"}
          >
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>
      )}

      <Collapse in={expanded || !showTitle}>
        <List
          sx={{
            maxHeight,
            overflow: 'auto',
            py: 0
          }}
          dense
        >
          {filteredErrors.map((error, index) => (
            <ListItem key={`${error.path}-${index}`} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ErrorIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={error.message}
                secondary={path ? error.path.replace(`${path}/`, '') : error.path}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default ValidationErrorDisplay;
