import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import DynamicSegmentFactory from './DynamicSegmentFactory';

interface SchemaBasedSegmentFactoryProps {
  type: string;
  segmentConfig: any;
  onChange: (updatedConfig: any) => void;
  segmentIndex: number;
  blockIndex: number;
}

/**
 * Factory component that loads the schema and passes it to DynamicSegmentFactory
 * This serves as a wrapper that handles schema loading and caching
 */
const SchemaBasedSegmentFactory: React.FC<SchemaBasedSegmentFactoryProps> = ({
  type,
  segmentConfig,
  onChange,
  segmentIndex,
  blockIndex
}) => {
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the schema
  useEffect(() => {
    async function loadSchema() {
      try {
        setLoading(true);
        setError(null);

        // First try to load from localStorage cache
        const cachedSchema = localStorage.getItem('schema');
        if (cachedSchema) {
          try {
            const parsed = JSON.parse(cachedSchema);
            setSchema(parsed);
            setLoading(false);
            return;
          } catch (e) {
            console.warn('Failed to parse cached schema, loading fresh copy');
          }
        }

        // If no cache or parse failed, load from file
        const schemaModule = await import('../../schemas/schema.json');
        setSchema(schemaModule);

        // Cache the schema for future use
        localStorage.setItem('schema', JSON.stringify(schemaModule));

        setLoading(false);
      } catch (err) {
        console.error('Failed to load schema:', err);
        setError('Failed to load schema. Using fallback properties.');
        setLoading(false);
      }
    }

    loadSchema();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  // Show error state
  if (error) {
    console.warn(error);
    // Continue with fallback implementation when schema can't be loaded
  }

  return (
    <DynamicSegmentFactory
      type={type}
      segmentConfig={segmentConfig}
      onChange={onChange}
      segmentIndex={segmentIndex}
      blockIndex={blockIndex}
      schema={schema}
    />
  );
};

export default SchemaBasedSegmentFactory;
