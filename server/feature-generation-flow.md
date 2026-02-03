# Feature Description Generation Flow

This document describes the process for generating feature descriptions that serve as the single source of truth for feature development. Feature descriptions are stored in the [`server/features/`](./features/) folder and must be created before implementing any feature.

## Overview

The feature description generation process ensures that all required information is captured before implementation begins. The generated feature description must meet all validation criteria defined in [`architecture.md`](./architecture.md) before it can be used for implementation.

## Process

### Step 1: Gather Initial Requirements

1. **Understand the feature request** from the user:
   - What is the feature supposed to do?
   - What problem does it solve?
   - Who will use it?

2. **Ask clarifying questions** if needed:
   - Business context and value
   - User personas and use cases
   - Integration requirements
   - Data requirements

3. **Determine domain organization**: Decide whether the feature extends an existing domain or requires a new domain folder according to the Decision-Making Guidelines in [`architecture.md`](./architecture.md):
   - **Extends existing domain**: The feature adds functionality to an existing domain (e.g., adding a new field or operation to an existing entity)
   - **New domain**: The feature represents a distinct business domain with its own data model, resolvers/services/DAOs
   - Reference the "When to Create a New Domain Folder" section in [`architecture.md`](./architecture.md) for guidance
   - Document this decision as it affects test suite organization (see [`testing.md`](./testing.md))

4. **Determine the feature name** and create the file path: [`server/features/feature-name.md`](./features/) (use kebab-case for the filename)

### Step 2: Generate and Confirm Sections One by One

Generate each required section **one at a time**, present it to the user, and **get confirmation before proceeding** to the next section. The feature description **must** include all 7 required sections in this order:

#### Section 1: Business Rationale

1. **Generate the Business Rationale section** including:
   - Clear value proposition
   - Business purpose
   - User benefit

2. **Present the section to the user** as normal output (not saved to file yet)

3. **Get user confirmation**:
   - Does this accurately capture the business value?
   - Are there any missing aspects?
   - Any corrections needed?

4. **Wait for user approval** before proceeding to Section 2

#### Section 2: Database Requirements

1. **Generate the Database Requirements section** including:
   - Database tables and structure
   - Schema files needed
   - Migrations required
   - Relationships and foreign keys
   - Indexes for performance

2. **Present the section to the user** as normal output

3. **Get user confirmation**:
   - Are all required tables identified?
   - Are relationships correct?
   - Any missing indexes or constraints?

4. **Wait for user approval** before proceeding to Section 3

#### Section 3: GraphQL/REST API Requirements

1. **Generate the GraphQL/REST API Requirements section** including:
   - GraphQL queries/mutations or REST routes
   - Type definitions
   - Authentication requirements
   - Authorization requirements

2. **Present the section to the user** as normal output

3. **Get user confirmation**:
   - Are all required API operations identified?
   - Are the types and schemas correct?
   - Any missing endpoints?

4. **Wait for user approval** before proceeding to Section 4

#### Section 4: Authorization Requirements

1. **Generate the Authorization Requirements section** including:
   - Who can access the feature
   - Organisation membership requirements
   - Role-based access requirements
   - Permission checks needed

2. **Present the section to the user** as normal output

3. **Get user confirmation**:
   - Are access controls correctly defined?
   - Are role requirements accurate?
   - Any missing permission checks?

4. **Wait for user approval** before proceeding to Section 5

#### Section 5: Configuration and Secrets

1. **Generate the Configuration and Secrets section** including:
   - New environment variables
   - New secrets required
   - Default values
   - Validation requirements

2. **Present the section to the user** as normal output

3. **Get user confirmation**:
   - Are all configuration needs identified?
   - Are secrets properly documented?
   - Any missing configuration values?

4. **Wait for user approval** before proceeding to Section 6

#### Section 6: Business Logic Description

1. **Generate the Business Logic Description section** including:
   - Clear, unambiguous description
   - Input/Output specifications
   - Edge cases
   - Validation rules
   - State transitions (if applicable)

2. **Present the section to the user** as normal output

3. **Get user confirmation**:
   - Is the logic description clear and complete?
   - Are all edge cases covered?
   - Are validation rules correct?
   - Any ambiguities that need clarification?

4. **Wait for user approval** before proceeding to Section 7

#### Section 7: Error Handling

1. **Generate the Error Handling section** including:
   - Explicit error handling description
   - Error types and scenarios
   - Error responses and status codes
   - Error propagation patterns
   - Logging requirements

2. **Present the section to the user** as normal output

3. **Get user confirmation**:
   - Are all error scenarios covered?
   - Are error responses appropriate?
   - Is logging properly specified?
   - Any missing error cases?

4. **Wait for user approval** before proceeding to finalization

### Step 3: Finalize Feature Description

Once all 7 sections have been generated and confirmed by the user:

1. **Automatically validate the complete feature description**:
   - **MUST run** `/validate-feature-spec` skill on the completed spec
   - **MUST launch** `spec-validator` subagent in background for comprehensive validation
   - Review validation results and address any issues
   - Validation checks against criteria from [`architecture.md`](./architecture.md):
     - ✅ **Business Rationale**: Clear business value and purpose documented
     - ✅ **Database Requirements**: All tables, schema files, migrations, and relationships documented
     - ✅ **GraphQL/REST API Requirements**: All API operations, types, authentication, and authorization documented
     - ✅ **Authorization Requirements**: All authorization checks and role requirements documented
     - ✅ **Configuration**: All configuration and secrets identified
     - ✅ **Business Logic**: Clear, unambiguous, detailed description provided
     - ✅ **Error Handling**: Explicit error handling description provided for all error scenarios

2. **Only after validation passes**: Save the complete feature description file in [`server/features/`](./features/) as `feature-name.md`

**Note**: Validation runs automatically as part of this step. Do not skip or make it conditional.

## Section Rejection and Revision

**If a section does not meet the validation criteria or user requirements, it must be revised before proceeding to the next section.**

When a section is rejected or needs revision:

1. **Identify the shortcomings**:
   - What information is missing?
   - What needs clarification?
   - What ambiguities need to be resolved?

2. **Revise the section** based on user feedback

3. **Re-present the revised section** to the user

4. **Get user approval** before proceeding to the next section

**Do not proceed to the next section until the current section is approved by the user.**

## Next Steps

Once a feature description is finalized and approved:

1. The feature description can be used with [`flow.md`](./flow.md) to implement the feature
2. Use the prompt: `generate feature X with flow.md` where X is the feature name
3. The implementation flow will read the feature description and follow the standardized development process

## References

- [`architecture.md`](./architecture.md) - Feature Description Template and validation criteria
- [`testing.md`](./testing.md) - Testing patterns and conventions
- [`flow.md`](./flow.md) - Feature implementation flow
