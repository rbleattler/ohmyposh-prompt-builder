const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readline = require('readline');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rename = promisify(fs.rename);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Root directory of the project
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Define file type mappings based on naming conventions and content
const FILE_TYPE_MAPPINGS = [
  // Common UI components
  { regex: /^(Tab|Modal|Dialog|Card|Button).*\.tsx$/, directory: 'components/common' },
  // Block-related components
  { regex: /^Block.*\.tsx$/, directory: 'components/blocks' },
  // Segment-related components
  { regex: /^(Segment|Draggable(Segment)).*\.tsx$/, directory: 'components/segments' },
  // Editor-related components
  { regex: /^(.*Editor|.*Picker|Properties.*)\.tsx$/, directory: 'components/editor' },
  // Preview-related components
  { regex: /^(.*Preview|Command.*)\.tsx$/, directory: 'components/preview' },
  // Layout-related components
  { regex: /^.*Layout\.tsx$/, directory: 'components/layout' },
  // Custom hooks
  { regex: /^use[A-Z].*\.ts$/, directory: 'hooks' },
  // Contexts
  { regex: /^.*Context\.tsx?$/, directory: 'contexts' },
  // Types/Interfaces
  { regex: /^[A-Z].*Types?\.ts$/, directory: 'types' },
  // Utilities
  { regex: /^.*Utils?\.ts$/, directory: 'utils' },
  // Factories
  { regex: /^.*Factory\.tsx?$/, directory: 'factories' }
];

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Promisify readline question
 */
function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

/**
 * Find all TypeScript/React files in the src directory and its subdirectories
 */
async function findAllTsFiles(dir) {
  const files = [];
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      const subFiles = await findAllTsFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Determine the appropriate directory for a file based on its name and content
 */
async function determineAppropriateDirectory(filePath) {
  const fileName = path.basename(filePath);

  // Check file name patterns first
  for (const mapping of FILE_TYPE_MAPPINGS) {
    if (mapping.regex.test(fileName)) {
      return mapping.directory;
    }
  }

  // If no match by filename, check content
  try {
    const content = await readFile(filePath, 'utf8');

    // Look for hooks
    if (content.includes('function use') || content.includes('const use') && content.includes('return {')) {
      return 'hooks';
    }

    // Look for React components
    if ((content.includes('React') || content.includes('react')) &&
        (content.includes('function') || content.includes('const')) &&
        content.includes('return (') && content.includes('props')) {
      // Determine component type from content
      if (content.includes('Block') || content.includes('block')) {
        return 'components/blocks';
      }
      if (content.includes('Segment') || content.includes('segment')) {
        return 'components/segments';
      }
      if (content.includes('Preview') || content.includes('preview')) {
        return 'components/preview';
      }
      if (content.includes('Layout') || content.includes('layout') || content.includes('Grid')) {
        return 'components/layout';
      }
      // Default to common for other React components
      return 'components/common';
    }

    // Look for context providers
    if (content.includes('createContext') || content.includes('Context.Provider')) {
      return 'contexts';
    }

    // Look for type definitions
    if (content.includes('interface ') || content.includes('type ') && !content.includes('return (')) {
      return 'types';
    }

    // Look for utilities
    if (content.includes('export function') && !content.includes('return (')) {
      return 'utils';
    }
  } catch (err) {
    console.error(`Error reading file: ${filePath}`, err);
  }

  // If no determination could be made, return null
  return null;
}

/**
 * Suggest directory moves for files that appear to be in the wrong place
 */
async function suggestDirectoryMoves() {
  console.log('Analyzing project files for potential reorganization...');

  const allTsFiles = await findAllTsFiles(SRC_DIR);
  const suggestedMoves = [];

  for (const file of allTsFiles) {
    // Get the relative path from src
    const relativePath = path.relative(SRC_DIR, file);

    // Skip files that are already in an index.ts file
    if (path.basename(file) === 'index.ts') {
      continue;
    }

    // Determine the appropriate directory
    const suggestedDir = await determineAppropriateDirectory(file);

    if (suggestedDir) {
      const currentDir = path.dirname(relativePath);

      // If the file isn't already in the suggested directory, add it to suggestions
      if (currentDir !== suggestedDir && !relativePath.startsWith(suggestedDir)) {
        suggestedMoves.push({
          file: relativePath,
          currentLocation: currentDir,
          suggestedLocation: suggestedDir
        });
      }
    }
  }

  return suggestedMoves;
}

/**
 * Move a file to a new location and update imports in all project files
 */
async function moveFileAndUpdateImports(filePath, newLocation) {
  const fullPath = path.join(SRC_DIR, filePath);
  const fileName = path.basename(filePath);
  const newFullPath = path.join(SRC_DIR, newLocation, fileName);

  // Create the target directory if it doesn't exist
  const targetDir = path.dirname(newFullPath);
  fs.mkdirSync(targetDir, { recursive: true });

  // Move the file
  console.log(`Moving ${filePath} to ${path.join(newLocation, fileName)}`);
  await rename(fullPath, newFullPath);

  // Update imports in all files
  await updateImportsInAllFiles(filePath, path.join(newLocation, fileName));
}

/**
 * Update import statements in all files after moving a file
 */
async function updateImportsInAllFiles(oldPath, newPath) {
  const allTsFiles = await findAllTsFiles(SRC_DIR);
  const oldImportPath = oldPath.replace(/\.tsx?$/, '');
  const newImportPath = newPath.replace(/\.tsx?$/, '');

  for (const file of allTsFiles) {
    try {
      let content = await readFile(file, 'utf8');
      let modified = false;

      // Replace direct imports
      const oldImportRegex = new RegExp(`from ['"](\\.{1,2}/)+${oldImportPath.replace(/\//g, '/')}['"]`, 'g');
      if (oldImportRegex.test(content)) {
        // Calculate the relative path from the file to the new module location
        const fileDir = path.dirname(path.relative(SRC_DIR, file));
        const relativeToNew = path.relative(fileDir, path.dirname(newPath)).replace(/\\/g, '/');
        const prefix = relativeToNew.startsWith('.') ? '' : './';
        const relativePath = `${prefix}${relativeToNew}/${path.basename(newPath).replace(/\.tsx?$/, '')}`;

        content = content.replace(oldImportRegex, `from "${relativePath}"`);
        modified = true;
      }

      // If the file was modified, write the changes
      if (modified) {
        await writeFile(file, content);
        console.log(`Updated imports in: ${path.relative(SRC_DIR, file)}`);
      }
    } catch (err) {
      console.error(`Error updating imports in ${file}:`, err);
    }
  }
}

/**
 * Main function to run the file reorganization
 */
async function main() {
  try {
    console.log('Starting file reorganization...');

    // Get suggested moves
    const suggestedMoves = await suggestDirectoryMoves();

    if (suggestedMoves.length === 0) {
      console.log('All files appear to be in the appropriate directories!');
      rl.close();
      return;
    }

    console.log(`Found ${suggestedMoves.length} files that could be reorganized.`);

    // Ask for confirmation and perform moves
    for (const move of suggestedMoves) {
      const answer = await question(
        `Move '${move.file}' from '${move.currentLocation}' to '${move.suggestedLocation}'? (y/n/all/quit) `
      );

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'all') {
        await moveFileAndUpdateImports(move.file, move.suggestedLocation);

        if (answer.toLowerCase() === 'all') {
          // Move all remaining files without asking
          for (const remainingMove of suggestedMoves.slice(suggestedMoves.indexOf(move) + 1)) {
            await moveFileAndUpdateImports(remainingMove.file, remainingMove.suggestedLocation);
          }
          break;
        }
      } else if (answer.toLowerCase() === 'q' || answer.toLowerCase() === 'quit') {
        break;
      }
    }

    console.log('File reorganization completed!');
    console.log('Remember to run "node scripts/organizeProjectStructure.js" to create any missing directories and update documentation.');
  } catch (err) {
    console.error('Error during file reorganization:', err);
  } finally {
    rl.close();
  }
}

// Execute the main function
main();