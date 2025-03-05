/**
 * Formats a validation path to a more readable display name
 *
 * @param path The path from a validation error
 * @returns A formatted display name
 */
export function formatValidationPath(path: string): string {
  if (!path || path === 'root' || path === '/') return 'Configuration root';

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // Replace slashes with dots for property paths
  const dotPath = cleanPath.replace(/\//g, '.');

  // Format array indices
  const formattedPath = dotPath.replace(/\.(\d+)\./g, '[$1].');

  return formattedPath;
}

/**
 * Groups validation errors by their parent path
 *
 * @param errors Array of validation errors
 * @returns Object with paths as keys and arrays of errors as values
 */
export function groupErrorsByPath(errors: Array<{ path: string; message: string }>) {
  return errors.reduce((acc, error) => {
    const pathParts = error.path.split('/');
    let parentPath = '';

    // Use the first level as the parent path
    if (pathParts.length > 0) {
      parentPath = pathParts[0] || 'root';
    } else {
      parentPath = 'root';
    }

    if (!acc[parentPath]) {
      acc[parentPath] = [];
    }

    acc[parentPath].push(error);
    return acc;
  }, {} as Record<string, typeof errors>);
}
