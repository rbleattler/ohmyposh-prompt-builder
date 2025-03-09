import React, { useMemo, useCallback } from 'react';
import SchemaCache from './SchemaCache';
import DynamicSegmentFactory from './DynamicSegmentFactory';
import { useSchema } from '../contexts/SchemaContext';
import { Box, Typography, CircularProgress } from '@mui/material';

interface SchemaBasedSegmentFactoryProps {
  type: string;
  config?: any;
  foreground: string;
  background: string;
  style?: string;
}

/**
 * A factory component that uses schema data and caching for efficient segment rendering
 */
const SchemaBasedSegmentFactory: React.FC<SchemaBasedSegmentFactoryProps> = (props) => {
  const { schema, isLoading, error } = useSchema();

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <Typography variant="body2">Loading schema...</Typography>
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography variant="body2">Error loading schema: {error}</Typography>
      </Box>
    );
  }

  // Ensure we always have a config object even if none is provided
  const config = props.config || {};

  // If schema is loaded, use DynamicSegmentFactory with the cached schema
  return <DynamicSegmentFactory
    type={props.type}
    config={config}
    foreground={props.foreground}
    background={props.background}
    style={props.style}
    schema={schema}
  />;
};

export default SchemaBasedSegmentFactory;
