# Example Feature

## Business Rationale

**Value Proposition:**
This is an example feature description that demonstrates the required structure for backend features. Replace this with your actual feature's business rationale.

**Business Purpose:**
- Example purpose 1
- Example purpose 2

**User Benefit:**
- Example user benefit 1
- Example user benefit 2

## Database Requirements

**Database Tables:**

1. **`example` table**
   - `id` (UUID, primary key)
   - `createdAt`, `updatedAt` (timestamps)
   - `name` (text, not null)
   - `description` (text, nullable)

**Schema Files:**
- `server/src/example/example.db.ts` — Example table definition

**Migrations:**
- Create migration file for example table

**Relationships:**
- None (standalone table)

## GraphQL/REST API Requirements

**GraphQL Operations:**

**Queries:**
- `example(id: String!): Example` — Get example by ID (requires authentication)

**Mutations:**
- `createExample(name: String!, description: String): Example!` — Create new example (requires authentication)

**Type Definitions:**
```graphql
type Example {
  id: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  description: String
}
```

**Authentication:**
- All operations require authentication

## Authorization Requirements

- Only authenticated users can access this feature
- No organisation membership required (example feature)
- No role-based access control needed

## Configuration and Secrets

- No new configuration or secrets required

## Business Logic Description

1. **Create Example:**
   - Validate that `name` is provided and not empty
   - Create new example record with provided data
   - Return created example

2. **Get Example:**
   - Verify example exists
   - Return example data

## Error Handling

- **BAD_REQUEST**: Returned when `name` is missing or empty during creation
- **NOT_FOUND**: Returned when example with given ID does not exist
- **UNAUTHORIZED**: Returned when user is not authenticated
