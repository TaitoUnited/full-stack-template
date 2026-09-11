// @ts-check
import {
  createRule,
  getCalleeName,
  getSourceCode,
} from '../../../../shared/oxlint/utils.js';

export const rule = createRule({
  meta: {
    type: 'problem',
    docs: {
      description: 'Avoid function references in useEffect dependency arrays.',
    },
    fixable: 'code',
    messages: {
      functionDependency:
        "Function '{{name}}' in effect deps. Remove it and wrap logic with useEffectEvent or move the logic. Changes in function references should not re-trigger effects as they never capture the intent of the effect. Only data-like values such as primitives should drive effects.",
    },
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    const effectHooks = ['useEffect', 'React.useEffect'];

    return {
      CallExpression(node) {
        if (!isHookCall({ node, names: effectHooks })) {
          return;
        }

        const dependencies = node.arguments?.[1];

        if (dependencies?.type !== 'ArrayExpression') {
          return;
        }

        for (const dependency of dependencies.elements ?? []) {
          if (!dependency) {
            continue;
          }

          if (isFunctionLikeDependency({ context, node: dependency })) {
            context.report({
              node: dependency,
              messageId: 'functionDependency',
              data: {
                name:
                  dependency.type === 'Identifier'
                    ? dependency.name
                    : 'function',
              },
              fix(fixer) {
                const fixes = [
                  buildRemoveDependencyFix({
                    arrayNode: dependencies,
                    element: dependency,
                    fixer,
                    sourceCode,
                  }),
                ];
                const wrapFixes = buildWrapFunctionFixes({
                  context,
                  element: dependency,
                  fixer,
                  sourceCode,
                });

                if (wrapFixes.length > 0) {
                  fixes.push(...wrapFixes);
                }

                return fixes;
              },
            });
          }
        }
      },
    };
  },
});

/**
 * @param {{ node: import("@oxlint/plugins").ESTree.CallExpression; names: string[] }} params
 */
function isHookCall({ node, names }) {
  const calleeName = getCalleeName(node);
  return calleeName ? names.includes(calleeName) : false;
}

/**
 * @param {import("@oxlint/plugins").ESTree.Node | null} init
 */
function isUseCallbackCall(init) {
  const calleeName =
    init?.type === 'CallExpression' ? getCalleeName(init) : undefined;
  return calleeName
    ? ['useCallback', 'React.useCallback'].includes(calleeName)
    : false;
}

/**
 * @param {import("@oxlint/plugins").ESTree.Node | null} init
 */
function isUseEffectEventCall(init) {
  const calleeName =
    init?.type === 'CallExpression' ? getCalleeName(init) : undefined;
  return calleeName
    ? ['useEffectEvent', 'React.useEffectEvent'].includes(calleeName)
    : false;
}

/**
 * @param {import("@oxlint/plugins").ESTree.Node | null} init
 */
function isUseStateCall(init) {
  const calleeName =
    init?.type === 'CallExpression' ? getCalleeName(init) : undefined;
  return calleeName
    ? ['useState', 'React.useState'].includes(calleeName)
    : false;
}

/**
 * @param {{
 *   node: import("@oxlint/plugins").ESTree.Node | null;
 *   context: import("@oxlint/plugins").Context;
 * }} params
 */
function isFunctionLikeDependency({ node, context }) {
  if (!node) {
    return false;
  }

  if (
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'FunctionExpression'
  ) {
    return true;
  }

  if (isUseEffectEventCall(node)) {
    return true;
  }

  if (node.type === 'Identifier') {
    return isFunctionLikeIdentifier({ context, node });
  }

  return false;
}

/**
 * @param {{
 *   node: import("@oxlint/plugins").ESTree.Node & { type: "Identifier"; name: string };
 *   context: import("@oxlint/plugins").Context;
 * }} params
 */
function isFunctionLikeIdentifier({ node, context }) {
  const scope = context.sourceCode.getScope(node);

  if (!scope) {
    return false;
  }

  const variable = findVariableInScope({ name: node.name, scope });

  if (!variable) {
    return false;
  }

  return variable.defs.some(definition => {
    const definitionNode = definition.node;

    if (
      definition.type === 'FunctionName' &&
      definitionNode.type === 'FunctionDeclaration'
    ) {
      return true;
    }

    if (
      definition.type !== 'Variable' ||
      definitionNode.type !== 'VariableDeclarator'
    ) {
      return false;
    }

    const init = definitionNode.init;

    if (
      init &&
      (init.type === 'ArrowFunctionExpression' ||
        init.type === 'FunctionExpression')
    ) {
      return true;
    }

    if (isUseCallbackCall(init) || isUseEffectEventCall(init)) {
      return true;
    }

    if (definitionNode.id.type !== 'ArrayPattern' || !isUseStateCall(init)) {
      return false;
    }

    const setter = definitionNode.id.elements[1];
    return setter?.type === 'Identifier' && setter.name === node.name;
  });
}

/**
 * @param {{ scope: import("@oxlint/plugins").Scope; name: string }} params
 */
function findVariableInScope({ scope, name }) {
  /** @type {import("@oxlint/plugins").Scope | null} */
  let currentScope = scope;

  while (currentScope) {
    const variable = currentScope.set.get(name);

    if (variable) {
      return variable;
    }

    currentScope = currentScope.upper;
  }
}

/**
 * @param {{
 *   arrayNode: import("@oxlint/plugins").ESTree.ArrayExpression;
 *   element: import("@oxlint/plugins").ESTree.Node;
 *   fixer: import("@oxlint/plugins").Fixer;
 *   sourceCode: import("@oxlint/plugins").SourceCode;
 * }} params
 */
function buildRemoveDependencyFix({ fixer, sourceCode, arrayNode, element }) {
  const elements = arrayNode.elements.filter(Boolean);

  if (elements.length === 1) {
    return fixer.replaceText(arrayNode, '[]');
  }

  const tokenBefore = sourceCode.getTokenBefore(element);
  const tokenAfter = sourceCode.getTokenAfter(element);

  if (tokenAfter && tokenAfter.value === ',') {
    return fixer.removeRange([element.range[0], tokenAfter.range[1]]);
  }

  if (tokenBefore && tokenBefore.value === ',') {
    return fixer.removeRange([tokenBefore.range[0], element.range[1]]);
  }

  return fixer.remove(element);
}

/**
 * @param {{
 *   context: import("@oxlint/plugins").Context;
 *   element: import("@oxlint/plugins").ESTree.Node;
 *   fixer: import("@oxlint/plugins").Fixer;
 *   sourceCode: import("@oxlint/plugins").SourceCode;
 * }} params
 */
function buildWrapFunctionFixes({ fixer, sourceCode, context, element }) {
  if (element.type !== 'Identifier') {
    return [];
  }

  const scope = context.sourceCode.getScope(element);

  if (!scope) {
    return [];
  }

  const variable = findVariableInScope({ name: element.name, scope });

  if (!variable) {
    return [];
  }

  for (const definition of variable.defs) {
    const definitionNode = definition.node;

    if (
      definition.type === 'FunctionName' &&
      definitionNode.type === 'FunctionDeclaration'
    ) {
      const functionText = sourceCode.getText(definitionNode);
      return [
        fixer.replaceText(
          definitionNode,
          `const ${element.name} = useEffectEvent(${functionText});`
        ),
        ...buildEnsureUseEffectEventImportFixes({ fixer, sourceCode }),
      ];
    }

    if (
      definition.type !== 'Variable' ||
      definitionNode.type !== 'VariableDeclarator'
    ) {
      continue;
    }

    if (
      definitionNode.id.type === 'ArrayPattern' &&
      isUseStateCall(definitionNode.init)
    ) {
      continue;
    }

    const init = definitionNode.init;

    if (!init || isUseEffectEventCall(init)) {
      continue;
    }

    if (
      init.type === 'ArrowFunctionExpression' ||
      init.type === 'FunctionExpression'
    ) {
      return [
        fixer.replaceText(init, `useEffectEvent(${sourceCode.getText(init)})`),
        ...buildEnsureUseEffectEventImportFixes({ fixer, sourceCode }),
      ];
    }

    if (isUseCallbackCall(init)) {
      const [callbackArgument] = init.arguments;

      if (!callbackArgument) {
        continue;
      }

      return [
        fixer.replaceText(
          init,
          `useEffectEvent(${sourceCode.getText(callbackArgument)})`
        ),
        ...buildEnsureUseEffectEventImportFixes({ fixer, sourceCode }),
      ];
    }
  }

  return [];
}

/**
 * @param {{
 *   fixer: import("@oxlint/plugins").Fixer;
 *   sourceCode: import("@oxlint/plugins").SourceCode;
 * }} params
 */
function buildEnsureUseEffectEventImportFixes({ fixer, sourceCode }) {
  const program = sourceCode.ast;
  const reactImport = program.body.find(
    node =>
      node.type === 'ImportDeclaration' &&
      node.source.type === 'Literal' &&
      node.source.value === 'react'
  );

  if (!reactImport) {
    return [
      fixer.insertTextBefore(
        program.body[0],
        'import { useEffectEvent } from "react";\n'
      ),
    ];
  }

  if (reactImport.type !== 'ImportDeclaration') {
    return [];
  }

  const namedSpecifiers = reactImport.specifiers.filter(
    specifier => specifier.type === 'ImportSpecifier'
  );
  const hasUseEffectEvent = namedSpecifiers.some(
    specifier =>
      specifier.imported.type === 'Identifier' &&
      specifier.imported.name === 'useEffectEvent'
  );

  if (hasUseEffectEvent) {
    return [];
  }

  if (namedSpecifiers.length > 0) {
    const lastNamedSpecifier = namedSpecifiers.at(-1);

    if (!lastNamedSpecifier) {
      return [];
    }

    return [fixer.insertTextAfter(lastNamedSpecifier, ', useEffectEvent')];
  }

  const defaultSpecifier = reactImport.specifiers.find(
    specifier => specifier.type === 'ImportDefaultSpecifier'
  );

  if (defaultSpecifier) {
    return [fixer.insertTextAfter(defaultSpecifier, ', { useEffectEvent }')];
  }

  return [
    fixer.insertTextAfter(
      reactImport,
      '\nimport { useEffectEvent } from "react";'
    ),
  ];
}
