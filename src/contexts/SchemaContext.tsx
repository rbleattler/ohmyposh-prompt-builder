import React, { createContext, useContext, useState, useEffect } from 'react';
import schemaUtils from '../utils/schemaUtils';

interface SchemaContextValue {
  availableSegmentTypes: string[];
  isLoading: boolean;
  error: string | null;
  getSegmentDefaults: (segmentType: string) => Record<string, any>;
  getPropertyDescription: (segmentType: string, property: string) => string | undefined;
  isPropertyRequired: (segmentType: string, property: string) => boolean;
  getSegmentSchema: (segmentType: string) => any;
  getBlockSchema: () => any;
}

const SchemaContext = createContext<SchemaContextValue>({
  availableSegmentTypes: [],
  isLoading: true,
  error: null,
  getSegmentDefaults: () => ({}),
  getPropertyDescription: () => undefined,
  isPropertyRequired: () => false,
  getSegmentSchema: () => ({}),
  getBlockSchema: () => ({}),
});

export const useSchemaContext = () => useContext(SchemaContext);

export const SchemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableSegmentTypes, setAvailableSegmentTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize schema data
  useEffect(() => {
    try {
      const segmentTypes = schemaUtils.getAvailableSegmentTypes();
      setAvailableSegmentTypes(segmentTypes);
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to initialize schema data: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
    }
  }, []);

  const value = {
    availableSegmentTypes,
    isLoading,
    error,
    getSegmentDefaults: schemaUtils.getSegmentDefaults,
    getPropertyDescription: schemaUtils.getPropertyDescription,
    isPropertyRequired: schemaUtils.isPropertyRequired,
    getSegmentSchema: schemaUtils.getSegmentSchema,
    getBlockSchema: schemaUtils.getBlockSchema,
  };

  return (
    <SchemaContext.Provider value={value}>
      {children}
    </SchemaContext.Provider>
  );
};
