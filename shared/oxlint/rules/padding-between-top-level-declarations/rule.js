// @ts-nocheck
// oxlint-disable

import {
  isDeclaration,
  isExportListDeclaration,
  isFunctionDeclaration,
  isFunctionOverloadPair,
  isImportDeclaration,
  isMultiline,
  isTypeAliasDeclaration,
  isVariableDeclaration,
  requireBlankLineAfter,
} from "../../spacing-utils.js";
import { createRule } from "../../utils.js";

export const rule = createRule({
  meta: {
    type: "layout",
    docs: {
      description: "Require a blank line between top-level declarations.",
    },
    fixable: "whitespace",
    messages: {
      expected: "Add exactly one blank line between these top-level declarations.",
    },
  },
  create(context) {
    return {
      Program(node) {
        for (let index = 0; index < node.body.length - 1; index += 1) {
          const declaration = node.body[index];
          const nextDeclaration = node.body[index + 1];

          if (!shouldCheck({ declaration, nextDeclaration })) {
            continue;
          }

          requireBlankLineAfter({
            context,
            node: declaration,
            nextNode: nextDeclaration,
            messageId: "expected",
          });
        }
      },
    };
  },
});

function shouldCheck({ declaration, nextDeclaration }) {
  if (
    !isDeclaration(declaration) ||
    !isDeclaration(nextDeclaration) ||
    isImportDeclaration(declaration) ||
    isImportDeclaration(nextDeclaration) ||
    isExportListDeclaration(declaration) ||
    isExportListDeclaration(nextDeclaration) ||
    isFunctionOverloadPair(declaration, nextDeclaration)
  ) {
    return false;
  }

  if (
    isSameManuallyGroupedKind(declaration, nextDeclaration) &&
    !isMultiline(declaration) &&
    !isMultiline(nextDeclaration)
  ) {
    return false;
  }

  // More specific rules own these boundaries and provide better diagnostics.
  return !isFunctionDeclaration(declaration) && !isMultiline(declaration);
}

function isSameManuallyGroupedKind(left, right) {
  return (
    (isVariableDeclaration(left) && isVariableDeclaration(right)) ||
    (isTypeAliasDeclaration(left) && isTypeAliasDeclaration(right))
  );
}
