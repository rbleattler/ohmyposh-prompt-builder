import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultSchema from '../schemas/schema.json';

interface SchemaContextType {
  schema: any;
  isLoading: boolean;
  error: string | null;
  updateSchema: (newSchema: any) => void;
}

const SchemaContext = createContext<SchemaContextType>({
  schema: null,
  isLoading: true,
  error: null,
  updateSchema: () => {},
});

export const useSchema = () => useContext(SchemaContext);

export const SchemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schema, setSchema] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with the default schema
    try {
      setSchema(defaultSchema);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading default schema:', err);
      setError('Failed to load schema definition');
      setIsLoading(false);
    }
  }, []);

  const updateSchema = (newSchema: any) => {
    try {
      setSchema(newSchema);
      setError(null);
    } catch (err) {
      console.error('Error updating schema:', err);
      setError('Failed to update schema definition');
    }
  };

  return (
    <SchemaContext.Provider value={{ schema, isLoading, error, updateSchema }}>
      {children}
    </SchemaContext.Provider>
  );
};

export default SchemaProvider;
