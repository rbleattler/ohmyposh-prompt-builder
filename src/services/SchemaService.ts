import { useEffect, useState } from 'react';

/**
 * Schema version information
 */
export interface SchemaVersionInfo {
  lastChecked: string;
  lastUpdated: string;
  version: string;
  hash: string;
  isOutdated: boolean;
}

/**
 * Hook to check if the schema is up-to-date
 * @returns Schema version information
 */
export const useSchemaVersion = (): { schemaInfo: SchemaVersionInfo | null, isLoading: boolean, error: string | null } => {
  const [schemaInfo, setSchemaInfo] = useState<SchemaVersionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSchema = async () => {
      try {
        setIsLoading(true);
        // Fetch both current schema meta and check for updates
        const meta = await import('../schemas/meta.json');

        // Check if the schema is older than 24 hours
        const lastChecked = new Date(meta.lastChecked);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60);

        const isOutdated = hoursDiff > 24;

        setSchemaInfo({
          ...meta,
          isOutdated
        });
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to check schema version: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    checkSchema();
  }, []);

  return { schemaInfo, isLoading, error };
};

/**
 * Get the last version update date as a formatted string
 */
export const getLastUpdatedFormatted = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Unknown date';
  }
};

export default {
  useSchemaVersion,
  getLastUpdatedFormatted
};