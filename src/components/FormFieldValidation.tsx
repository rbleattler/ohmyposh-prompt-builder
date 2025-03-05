import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useValidation } from '../contexts/ValidationContext';
import { formatValidationPath } from '../utils/validationUtils';

interface FormFieldValidationProps {
  path: string;
}

/**
 * Component that shows validation errors for a specific form field
 */
const FormFieldValidation: React.FC<FormFieldValidationProps> = ({ path }) => {
  const { getErrorsForPath } = useValidation();
  const errors = getErrorsForPath(path);

  if (errors.length === 0) {
    return null;
  }

  return (
    <Tooltip
      title={
        <Box>
          {errors.map((error, index) => (
            <Box key={index} sx={{ mb: index < errors.length - 1 ? 1 : 0 }}>
              <Typography variant="caption" color="error">
                {error.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Path: {formatValidationPath(error.path)}
              </Typography>
            </Box>
          ))}
        </Box>
      }
      arrow
    >
      <ErrorOutlineIcon
        color="error"
        fontSize="small"
        sx={{ ml: 1, verticalAlign: 'middle' }}
      />
    </Tooltip>
  );
};

export default FormFieldValidation;
