// @ts-nocheck
// oxlint-disable

import {
  isControlFlowStatement,
  isDirective,
  isExportListDeclaration,
  isFunctionDeclaration,
  isImportDeclaration,
  isMultiline,
  isVariableDeclaration,
  requireBlankLineAfter,
  unwrapExport,
} from "../../spacing-utils.js";
import { createRule } from "../../utils.js";

export const rule = createRule({
  meta: {
    type: "layout",
    docs: {
      description: "Require a blank line after other multiline statements.",
    },
    fixable: "whitespace",
    messages: {
      expected: "Add exactly one blank line after this multiline statement.",
    },
  },
  create(context) {
    function checkStatements(node) {
      const statements = node.type === "SwitchCase" ? node.consequent : node.body;

      for (let index = 0; index < statements.length - 1; index += 1) {
        const statement = statements[index];

        if (!isResidualMultilineStatement(statement)) {
          continue;
        }

        requireBlankLineAfter({
          context,
          node: statement,
          nextNode: statements[index + 1],
          messageId: "expected",
        });
      }
    }

    return {
      Program: checkStatements,
      BlockStatement: checkStatements,
      StaticBlock: checkStatements,
      SwitchCase: checkStatements,
      TSModuleBlock: checkStatements,
    };
  },
});

function isResidualMultilineStatement(node) {
  const statement = unwrapExport(node);

  return (
    isMultiline(node) &&
    !isImportDeclaration(node) &&
    !isExportListDeclaration(node) &&
    !isDirective(node) &&
    !isFunctionDeclaration(node) &&
    !isVariableDeclaration(node) &&
    !isControlFlowStatement(node) &&
    statement.type !== "TSDeclareFunction"
  );
}
