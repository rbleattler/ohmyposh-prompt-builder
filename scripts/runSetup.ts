export {};

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Oh My Posh Profile Builder setup...');

// Ensure node modules are installed
try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', encoding: 'utf-8' });
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Create directory structure
try {
  console.log('Creating directory structure...');
  execSync('npm run init-schema-dirs', { stdio: 'inherit', encoding: 'utf-8' });
} catch (error) {
  console.error('Failed to create directory structure:', error);
  process.exit(1);
}

// Ensure schema.json exists
const schemaPath = path.join(__dirname, '../src/schemas/schema.json');
if (!fs.existsSync(schemaPath)) {
  console.log('Schema file not found, creating it...');

  try {
    // Run schema generation
    execSync('npm run generate-schema-types', { stdio: 'inherit', encoding: 'utf-8' });
    console.log('Schema generated successfully.');
  } catch (error) {
    console.error('Failed to generate schema:', error);
    process.exit(1);
  }
} else {
  console.log('Schema file already exists.');

  // Check if schema needs updating
  try {
    console.log('Checking for schema updates...');
    execSync('npm run check-schema-updates', {
      stdio: 'inherit',
      encoding: 'utf-8'
    });
  } catch (error) {
    console.log('Schema needs to be updated, regenerating...');
    try {
      execSync('npm run generate-schema-types', { stdio: 'inherit', encoding: 'utf-8' });
      console.log('Schema updated successfully.');
    } catch (updateError) {
      console.error('Failed to update schema:', updateError);
      process.exit(1);
    }
  }
}

console.log('Setup completed successfully!');
console.log('You can now run:');
console.log('  npm start - to start the development server');
console.log('  npm run build - to create a production build');
