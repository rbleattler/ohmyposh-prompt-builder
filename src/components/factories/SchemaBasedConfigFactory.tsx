import React, { useMemo } from 'react';
import SchemaCache from './SchemaCache';
import DynamicSegmentConfigFactory from './DynamicSegmentConfigFactory';
import { useSchema } from '../../contexts/SchemaContext';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

interface SchemaBasedConfigFactoryProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
  foreground: string;
  background: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

/**
 * A factory component that uses schema data and caching for efficient segment configuration
 */
const SchemaBasedConfigFactory: React.FC<SchemaBasedConfigFactoryProps> = (props) => {
  const { schema, isLoading, error } = useSchema();
  const cache = useMemo(() => SchemaCache.getInstance(), []);

  // Handle loading state
  if (isLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Loading schema...</Typography>
        </Box>
      </Paper>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography variant="body2">Error loading schema: {error}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Basic segment configuration is still available.
          </Typography>
        </Box>
      </Paper>
    );
  }

  // If schema is loaded, use DynamicSegmentConfigFactory with the cached schema
  return <DynamicSegmentConfigFactory {...props} schema={schema} />;
};

export default SchemaBasedConfigFactory;