// @ts-nocheck
// oxlint-disable

import { isMultiline, isVariableDeclaration, requireBlankLineAfter } from "../../spacing-utils.js";
import { createRule } from "../../utils.js";

export const rule = createRule({
  meta: {
    type: "layout",
    docs: {
      description: "Require a blank line after multiline variable declarations.",
    },
    fixable: "whitespace",
    messages: {
      expected: "Add exactly one blank line after this multiline variable declaration.",
    },
  },
  create(context) {
    function checkStatements(node) {
      const statements = node.type === "SwitchCase" ? node.consequent : node.body;

      for (let index = 0; index < statements.length - 1; index += 1) {
        const statement = statements[index];

        if (!isVariableDeclaration(statement) || !isMultiline(statement)) {
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
