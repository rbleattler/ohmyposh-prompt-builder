export {};
import { generateSegmentTypesFile } from '../src/utils/segmentTypeGenerator';

// Run the generation script
async function main() {
  try {
    console.log('Generating segment types from schema...');
    await generateSegmentTypesFile();
    console.log('Segment types generated successfully');
  } catch (error) {
    console.error('Failed to generate segment types:', error);
    process.exit(1);
  }
}

main();
