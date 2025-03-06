import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

// Define the schema context type
interface SchemaContextType {
  schema: any;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  checkForUpdates: () => Promise<boolean>;
}

// Create the context
const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

// Provider component
export const SchemaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schema, setSchema] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load schema from local storage or file
  useEffect(() => {
    const loadSchema = async () => {
      try {
        setIsLoading(true);
        // First try to load from local schema.json
        try {
          const localSchema = await import('../schemas/schema.json');
          setSchema(localSchema.default || localSchema);

          // Load metadata to get last updated date
          try {
            const metadata = await import('../schemas/meta.json');
            setLastUpdated(metadata.lastUpdated);
          } catch (metaError) {
            console.warn('Schema metadata not found or invalid');
            setLastUpdated(null);
          }
        } catch (localError) {
          // If local schema fails, try to fetch from remote
          console.warn('Local schema not found, attempting to fetch remote schema');
          const remoteSchema = await fetchRemoteSchema();
          setSchema(remoteSchema);
          setLastUpdated(new Date().toISOString());
        }

        setIsLoading(false);
      } catch (err) {
        setError(`Failed to load schema: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    loadSchema();
  }, []);

  // Function to fetch remote schema
  const fetchRemoteSchema = async () => {
    const SCHEMA_URL = 'https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json';
    const response = await axios.get(SCHEMA_URL);
    return response.data;
  };

  // Function to check for schema updates
  const checkForUpdates = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const remoteSchema = await fetchRemoteSchema();

      // Check if schema differs from current
      const isDifferent = JSON.stringify(remoteSchema) !== JSON.stringify(schema);

      if (isDifferent) {
        setSchema(remoteSchema);
        setLastUpdated(new Date().toISOString());
      }

      setIsLoading(false);
      return isDifferent;
    } catch (err) {
      setError(`Failed to check for updates: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
      return false;
    }
  };

  // Context value
  const contextValue: SchemaContextType = {
    schema,
    isLoading,
    error,
    lastUpdated,
    checkForUpdates
  };

  return (
    <SchemaContext.Provider value={contextValue}>
      {children}
    </SchemaContext.Provider>
  );
};

// Custom hook to use the schema context
export const useSchema = () => {
  const context = useContext(SchemaContext);
  if (context === undefined) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
};
