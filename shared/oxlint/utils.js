// @ts-nocheck

/**
 * @param {{ name: string; rules: Record<string, import("@oxlint/plugins").Rule> }} params
 */
export function createPlugin({ name, rules }) {
  return {
    meta: {
      name,
      version: "0.1.0",
    },
    rules,
    configs: {
      recommended: {
        plugins: [name],
        rules: Object.fromEntries(
          Object.keys(rules).map((ruleName) => [`${name}/${ruleName}`, "error"]),
        ),
      },
    },
  };
}

/**
 * @param {import("@oxlint/plugins").Rule} rule
 * @returns {import("@oxlint/plugins").Rule}
 */
export function createRule(rule) {
  return rule;
}

/**
 * @param {import("@oxlint/plugins").Context} context
 */
export function getSourceCode(context) {
  return context.sourceCode ?? context.getSourceCode();
}

/**
 * @param {import("@oxlint/plugins").ESTree.Node | undefined | null} node
 * @returns {string | undefined}
 */
export function getIdentifierName(node) {
  if (!node) {
    return;
  }

  if (node.type === "Identifier" || node.type === "JSXIdentifier") {
    return node.name;
  }

  if (node.type === "ThisExpression") {
    return "this";
  }

  if (node.type === "MemberExpression" && !node.computed) {
    const objectName = getIdentifierName(node.object);
    const propertyName = getIdentifierName(node.property);
    return objectName && propertyName ? `${objectName}.${propertyName}` : undefined;
  }

  if (node.type === "TSQualifiedName") {
    const leftName = getIdentifierName(node.left);
    const rightName = getIdentifierName(node.right);
    return leftName && rightName ? `${leftName}.${rightName}` : undefined;
  }
}

/**
 * @param {import("@oxlint/plugins").ESTree.Node | undefined | null} node
 * @returns {string | undefined}
 */
export function getCalleeName(node) {
  return node?.type === "CallExpression" ? getIdentifierName(node.callee) : undefined;
}

/**
 * @param {import("@oxlint/plugins").ESTree.Node | undefined | null} node
 */
export function unwrapParameter(node) {
  if (node?.type === "AssignmentPattern") {
    return unwrapParameter(node.left);
  }

  if (node?.type === "TSParameterProperty") {
    return unwrapParameter(node.parameter);
  }

  return node;
}
