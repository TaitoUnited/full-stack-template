# Code style

Use the repository's automated checks as the source of truth. Oxlint enforces
correctness, imports, TypeScript, React, and project-local rules;
Oxfmt owns formatting. Do not add formatter or linter suppressions merely to
preserve an old style unless the surrounding framework contract genuinely requires it.

## TypeScript

- Prefer named exports, `type` aliases, explicit domain names, and direct functions over broad abstractions.
- Use a named object parameter for functions with more than two inputs or two easily swapped values of the same type.
- Keep external data as `unknown` until it is validated. Do not use assertions to bypass validation.
- Use `node:` imports for Node built-ins and do not introduce cyclic imports or broad barrel imports that obscure ownership.

## Client

- Use semantic HTML and existing React Aria/UI-kit controls.
- Keep route state in TanStack Router and server state in Apollo Client. Do not duplicate either in local component state.
- Use Lingui for static user-facing strings. Keep generated GraphQL, Panda, locale, and sprite output out of manual edits.

## Server

- Keep resolvers and REST routes thin. Put domain behavior and authorization in services, database access in DAOs, and table definitions in `*.db.ts` modules.
- Use the shared logging and error boundaries. Do not use `console` in request or domain code, or log credentials and sensitive payloads.

Run `npm run verify` from the affected package after changes; run focused tests
appropriate to the changed behavior when they are not included by that package's
verification command.

## Readability

This guide describes how this template uses whitespace to make TypeScript and TSX
easier for humans to scan. [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
owns mechanical formatting such as indentation, quotes, line wrapping, and commas.
The template's custom Oxlint rules add consistent visual separation where formatting
alone cannot express the structure clearly.

The goal is not to maximize whitespace. The goal is to make the visible shape of
the code match its syntactic structure while preserving room for authors to show
semantic relationships.

### Why visual structure matters

Developers rarely read a source file strictly from the first character to the
last. We scan for declarations, guards, operations, and return paths, then focus
on the section relevant to the current task. Whitespace therefore acts as part of
the interface through which we understand a program.

Three observations inform these conventions:

- **Proximity creates groups.** Human vision tends to perceive nearby elements
  as belonging together and separated elements as different groups. A blank line
  is therefore a strong, low-cost boundary between code units.
- **Working memory is limited.** Research commonly places the capacity of the
  focus of attention at roughly four chunks under controlled conditions. Clear
  visual boundaries help readers treat a complete function, block, or
  declaration as a chunk instead of retaining its individual lines while finding
  where the next operation begins.
- **Source-code reading requires visual navigation.** Eye-tracking research uses
  fixations, regressions, and reading order to measure the effort involved in
  program comprehension. Consistent structure gives the eye predictable places
  to enter, leave, and resume a code region.

These findings motivate the direction of the rules, but they do not prove that
one exact layout is optimal for every person or program. The specific rules below
are engineering conventions: they apply the principles consistently, avoid
subjective lint diagnostics, and leave semantic grouping decisions to authors.

Too little whitespace makes unrelated structures merge into one visual mass. Too
much whitespace breaks related code into fragments and reduces how much useful
context fits on screen. This template therefore uses exactly one blank line for a
structural boundary and never uses multiple blank lines for emphasis.

### Enforced rules

The client configuration exposes these rules with the `full-stack-template-client/`
prefix; the server uses `full-stack-template-server/`. The rule names and behavior are otherwise the
same. The JSX rule is client-only.

#### `padding-after-function`

Add one blank line after a function declaration or a class/object method when
another item follows in the same container. The whitespace marks the end of the
function's local scope and gives the next declaration a clear visual start.

**Bad**

```ts
function loadMember() {
  return memberRepository.find();
}
function saveMember(member: Member) {
  return memberRepository.save(member);
}
```

**Good**

```ts
function loadMember() {
  return memberRepository.find();
}

function saveMember(member: Member) {
  return memberRepository.save(member);
}
```

Class and object methods follow the same standard. TypeScript overload signatures
stay attached to one another and to their implementation because they describe a
single callable unit.

```ts
function parseMember(value: string): Member;
function parseMember(value: MemberInput): Member;
function parseMember(value: string | MemberInput): Member {
  return typeof value === "string" ? parseMemberId(value) : createMember(value);
}

function saveMember(member: Member) {
  // ...
}
```

#### `padding-after-multiline-variable`

Add one blank line after a multiline variable declaration when another statement
follows. A declaration spanning several lines occupies a larger visual region;
the blank line makes its closing delimiter easier to distinguish from the next
operation.

The complete declaration determines whether it is multiline. This includes the
binding pattern, type annotation, and initializer.

**Bad**

```ts
const sessionOptions = {
  expiresIn: sessionDuration,
  secure: true,
};
const session = createSession(sessionOptions);
```

**Good**

```ts
const sessionOptions = {
  expiresIn: sessionDuration,
  secure: true,
};

const session = createSession(sessionOptions);
```

No blank line is required after the final declaration in a block:

```ts
export const sessionOptions = {
  expiresIn: sessionDuration,
  secure: true,
};
```

#### `padding-after-block`

Add one blank line after a multiline control-flow statement when another
statement follows. This separates the conditional or repeated region from the
next step on the main reading path.

**Bad**

```ts
if (!member) {
  throw new Error("Member was not found");
}
return createSession(member);
```

**Good**

```ts
if (!member) {
  throw new Error("Member was not found");
}

return createSession(member);
```

Syntactically connected clauses remain attached. Separating them would weaken
the visual signal that they form one statement.

```ts
try {
  await saveMember(member);
} catch (error) {
  reportError(error);
} finally {
  releaseLock();
}

return member;
```

The rule does not require blank lines between `switch` cases. The entire switch
is treated as one control-flow unit.

#### `padding-after-multiline-statement`

Add one blank line after other multiline statements, including chained calls,
multiline `return` or `throw` statements, and calls containing multiline
callbacks. This rule covers syntactic units not owned by the more specific
function, variable, or block rules.

**Bad**

```ts
await membershipService.synchronizeOrganizationMembers({
  organizationId,
  memberIds: members.map(({ id }) => id),
});
recordMemberQuery();
```

**Good**

```ts
await membershipService.synchronizeOrganizationMembers({
  organizationId,
  memberIds: members.map(({ id }) => id),
});

recordMemberQuery();
```

Imports, export lists, re-exports, and directive prologues are excluded. Their
layout is formatter-owned, and compact re-export groups are encouraged:

```ts
export { ChatContainer, type ChatContainerProps } from "./chat-container";
export { ChatInput, type ChatInputProps } from "./chat-input";
export { ChatMarkdown } from "./chat-markdown";
```

#### `padding-between-jsx-siblings`

Add one blank line after a multiline JSX element, fragment, or expression
container when another structural sibling follows. Multiline JSX often
represents a complete control, conditional region, or content section. The blank
line lets the closing tag act as a reliable exit point before the reader scans
the next sibling.

**Bad**

```tsx
<section>
  <MemberHeader
    member={member}
    organization={organization}
    propertyManagementUnit={propertyManagementUnit}
  />
  {member.isActive ? (
    <ActiveMemberDetails member={member} />
  ) : (
    <InactiveMemberDetails member={member} />
  )}
  <MemberActions member={member} />
</section>
```

**Good**

```tsx
<section>
  <MemberHeader
    member={member}
    organization={organization}
    propertyManagementUnit={propertyManagementUnit}
  />

  {member.isActive ? (
    <ActiveMemberDetails member={member} />
  ) : (
    <InactiveMemberDetails member={member} />
  )}

  <MemberActions member={member} />
</section>
```

Parents containing meaningful JSX text are exempt because changing whitespace
can change rendered content. Keep inline prose compact and intentional:

```tsx
<p>
  Welcome <strong>{member.name}</strong> to the organization.
</p>
```

#### `padding-between-top-level-declarations`

Separate top-level declarations when the boundary is not covered by a more
specific rule. At file scale, blank lines create landmarks that make it easier to
find the start of a type, constant section, helper, or exported API.

**Bad**

```ts
type MemberId = string;
const defaultMemberId = "unknown";
function getDefaultMemberId() {
  return defaultMemberId;
}
```

**Good**

```ts
type MemberId = string;

const defaultMemberId = "unknown";

function getDefaultMemberId() {
  return defaultMemberId;
}
```

Consecutive single-line variables and consecutive single-line type aliases are
deliberately exempt. Their semantic relationship is known by the author, not by
the AST. Both compact and manually separated groups are valid:

```ts
type ButtonSize = "small" | "normal" | "large";
type ButtonColor = "primary" | "success" | "error" | "neutral";
type ButtonIconPlacement = "start" | "end";

const defaultSize: ButtonSize = "normal";
const defaultColor: ButtonColor = "primary";
```

Multiline type aliases always receive structural separation, whether or not they
are exported.

**Bad**

```ts
export type MemberSummary = {
  id: string;
  name: string;
};
export type MemberDetails = {
  id: string;
  name: string;
  email: string | null;
};
```

**Good**

```ts
export type MemberSummary = {
  id: string;
  name: string;
};

export type MemberDetails = {
  id: string;
  name: string;
  email: string | null;
};
```

Members inside a type or interface body remain compact. They are properties of
one shape, not independent top-level declarations:

```ts
type DialogOptions = {
  housingCommunity: {
    id: string;
    name: string;
  };
  onClose: () => void;
};
```

#### `no-extra-empty-lines`

Use at most one blank line, and do not place blank lines immediately inside an
opening or closing delimiter. A single boundary is visually strong enough;
larger gaps consume vertical context without adding a new structural meaning.

**Bad**

```text
const minimumRoleCount = 1;


const maximumRoleCount = 10;
```

**Good**

```text
const minimumRoleCount = 1;

const maximumRoleCount = 10;
```

Container edges follow the same principle.

**Bad**

```text
function activateMember() {

  member.activate();

}
```

**Good**

```text
function activateMember() {
  member.activate();
}
```

The rule operates only on whitespace between syntax and comments. It does not
rewrite whitespace inside strings, template literals, comments, or meaningful
JSX text.

### Logical grouping remains a human decision

The linter recognizes syntax and physical line spans. It does not try to infer
whether two variables serve the same feature, whether several hooks form one
workflow, or whether a group of statements represents a conceptual phase.

Use a single blank line manually between conceptual steps such as:

- preparing inputs;
- validating preconditions;
- performing an operation;
- interpreting its result;
- updating state or returning.

Keep tightly related single-line statements together. Do not add a blank line
after every statement merely because blank lines are available. The best layout
lets a reader see both the local relationships and the larger execution path.

### Applying the rules

Run Oxfmt before Oxlint when cleaning up an unformatted file. Oxfmt establishes
the canonical line wrapping; Oxlint can then determine which statements are
multiline and add the structural spacing.

```sh
npm --prefix client run format:write
npm --prefix client run lint:fix

npm --prefix server run format:write
npm --prefix server run lint:fix
```

Review JSX changes for intentional text spacing, then run the relevant
verification command documented in [Testing](testing/verification.md).
