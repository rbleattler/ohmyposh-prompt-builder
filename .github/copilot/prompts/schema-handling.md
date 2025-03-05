---
description: Instructions for working with JSON schema in oh-my-posh builder
when: "src/(schemas|utils|types)/|.*schema.*"
weight: 15
---
# JSON Schema Handling

## Schema Architecture

The application uses JSON Schema for:

1. Validation of oh-my-posh theme configurations
2. Generation of TypeScript types
3. Dynamic UI generation for segment configuration
4. Property constraints and default values

## Schema Generation Workflow

1. The source schema is fetched from the oh-my-posh GitHub repository
2. Local schema files are stored in `src/schemas/`
3. TypeScript types are generated from the schema in `src/types/schema/`
4. Segment types are extracted from the schema to `src/generated/segmentTypes.ts`

## Schema Utilities

When working with schema-related code:

1. **SchemaPropertyExtractor**:
   - Use for extracting segment properties from JSON schema
   - Extract property types, constraints, and defaults
   - Map JSON Schema types to appropriate UI control types

2. **Schema Cache**:
   - Use SchemaCache for efficient schema storage/retrieval
   - Handle schema versioning and updates
   - Respect TTL (Time To Live) for cache entries

3. **Schema Validation**:
   - Use Ajv for schema validation
   - Provide clear error messages for validation failures
   - Map validation errors to specific form fields

## Type Generation

When generating TypeScript types from schema:

1. Use `json-schema-to-typescript` for conversion
2. Keep generated types in sync with schema
3. Export types for components, blocks, and segments
4. Handle schema references properly

## Example Schema Property Extraction

```typescript
const extractor = new SchemaPropertyExtractor(schema);
const properties = extractor.extractSegmentProperties('git');
```
