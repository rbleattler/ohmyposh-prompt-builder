const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Root directory of the project
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');


// Define expected directories as per the documentation
const EXPECTED_DIRS = {
  'components': [
    'blocks',
    'segments',
    'editor',
    'common',
    'preview',
    'layout'
  ],
  'hooks': [],
  'contexts': [],
  'types': ['schema'],
  'schemas': [],
  'utils': [],
  'factories': [],
  'defaults': [],
  'generated': [],
  'fonts': [],
  'img': [],
  'services': []
};

// Files to ensure have index.ts exports
const DIRECTORIES_NEEDING_INDEX = [
  'components/blocks',
  'components/segments',
  'components/editor',
  'components/common',
  'components/preview',
  'components/layout',
  'hooks',
  'contexts',
  'utils'
];

// Add a prompt to confirm before proceeding, show the user the directories that will be created
console.log('This script will organize the project structure by creating required directories and index.ts files.');
console.log('The following directories will be created:');


/**
 * Creates directories if they don't exist
 */
async function ensureDirectories() {
  console.log('Ensuring required directories exist...');

  for (const dir of Object.keys(EXPECTED_DIRS)) {
    const fullDir = path.join(SRC_DIR, dir);
    await createDirIfNotExists(fullDir);

    for (const subdir of EXPECTED_DIRS[dir]) {
      const fullSubDir = path.join(fullDir, subdir);
      await createDirIfNotExists(fullSubDir);
    }
  }
}

/**
 * Creates a directory if it doesn't exist
 */
async function createDirIfNotExists(dir) {
  try {
    await stat(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Creating directory: ${dir}`);
      await mkdir(dir, { recursive: true });
    } else {
      throw err;
    }
  }
}

/**
 * Scans the project to find the actual structure
 */
async function scanProjectStructure() {
  console.log('Scanning project structure...');

  const actualStructure = {};

  const entries = await readdir(SRC_DIR);

  for (const entry of entries) {
    const fullPath = path.join(SRC_DIR, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      actualStructure[entry] = await scanDirectory(fullPath);
    }
  }

  return actualStructure;
}

/**
 * Scans a directory and returns its structure
 */
async function scanDirectory(dir) {
  const structure = {};
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      structure[entry] = await scanDirectory(fullPath);
    }
  }

  return structure;
}

/**
 * Creates index.ts files for directories that need them
 */
async function createIndexFiles() {
  console.log('Creating index.ts files for required directories...');

  for (const dir of DIRECTORIES_NEEDING_INDEX) {
    const fullDir = path.join(SRC_DIR, dir);
    await createIndexForDir(fullDir);
  }
}

/**
 * Creates an index.ts file for a specific directory
 */
async function createIndexForDir(dir) {
  try {
    const files = await readdir(dir);
    const indexPath = path.join(dir, 'index.ts');

    // Skip if index already exists
    try {
      await stat(indexPath);
      console.log(`Index file already exists: ${indexPath}`);
      return;
    } catch (err) {
      // Continue if file doesn't exist
      if (err.code !== 'ENOENT') throw err;
    }

    // Generate exports for TypeScript files (excluding the index itself)
    const tsFiles = files.filter(file =>
      (file.endsWith('.ts') || file.endsWith('.tsx')) &&
      file !== 'index.ts'
    );

    if (tsFiles.length === 0) {
      console.log(`No TypeScript files found in ${dir}, skipping index creation`);
      return;
    }

    const exports = [];

    for (const file of tsFiles) {
      const basename = path.basename(file, path.extname(file));

      // Skip test files
      if (basename.endsWith('.test')) continue;

      // Export both the default and named exports
      exports.push(`export { default as ${basename} } from './${basename}';`);

      // For type exports, attempt to identify exported types/interfaces
      try {
        const content = await readFile(path.join(dir, file), 'utf8');
        const exportedTypes = [];

        // Simple regex to find exported interfaces and types
        const interfaceMatches = content.match(/export\s+interface\s+([a-zA-Z0-9_]+)/g);
        if (interfaceMatches) {
          for (const match of interfaceMatches) {
            const name = match.split(/\s+/)[2];
            exportedTypes.push(name);
          }
        }

        const typeMatches = content.match(/export\s+type\s+([a-zA-Z0-9_]+)/g);
        if (typeMatches) {
          for (const match of typeMatches) {
            const name = match.split(/\s+/)[2];
            exportedTypes.push(name);
          }
        }

        if (exportedTypes.length > 0) {
          exports.push(`export type { ${exportedTypes.join(', ')} } from './${basename}';`);
        }
      } catch (err) {
        console.error(`Error analyzing ${file} for types:`, err);
      }
    }

    // Write index.ts file
    console.log(`Creating index file: ${indexPath}`);
    await writeFile(indexPath, exports.join('\n') + '\n');
  } catch (err) {
    console.error(`Error creating index for ${dir}:`, err);
  }
}

/**
 * Updates the project structure documentation
 */
async function updateDocumentation() {
  console.log('Updating project structure documentation...');

  const actualStructure = await scanProjectStructure();

  // Generate markdown representation of the project structure
  let directoryTree = '```\nsrc/\n';

  // Sort and iterate through top-level directories
  const sortedDirs = Object.keys(actualStructure).sort();

  for (const dir of sortedDirs) {
    directoryTree += `├── ${dir}/\n`;
    const subDirs = Object.keys(actualStructure[dir]).sort();

    for (let i = 0; i < subDirs.length; i++) {
      const isLast = i === subDirs.length - 1;
      const subDir = subDirs[i];
      directoryTree += `│   ${isLast ? '└──' : '├──'} ${subDir}/\n`;
    }
  }

  directoryTree += '```';

  // Read the current documentation file
  const docFilePath = path.join(DOCS_DIR, 'project-structure.md');
  let docContent;

  try {
    docContent = await readFile(docFilePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Create a basic doc if it doesn't exist
      docContent = `# Project Structure\n\nThis document describes the organization of the oh-my-posh-profile-builder project.\n\n## Directory Structure\n\n`;
    } else {
      throw err;
    }
  }

  // Replace the directory structure section
  const updatedContent = docContent.replace(
    /```[^`]*```/s,
    directoryTree
  );

  // Write the updated content
  await writeFile(docFilePath, updatedContent);
  console.log(`Updated documentation at: ${docFilePath}`);
}

/**
 * Main function to run all steps
 */
async function main() {
  try {
    await ensureDirectories();
    await createIndexFiles();
    await updateDocumentation();

    console.log('Project structure organization completed successfully!');
  } catch (err) {
    console.error('Error organizing project structure:', err);
    process.exit(1);
  }
}

// Execute the main function
main();