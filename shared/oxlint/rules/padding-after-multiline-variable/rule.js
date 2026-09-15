// @ts-nocheck
// oxlint-disable

import { isMultiline, isVariableDeclaration, requireBlankLineAfter } from "../../spacing-utils.js";
import { createRule } from "../../utils.js";

export const rule = createRule({
  meta: {
    type: "layout",
    docs: {
      description: "Require a blank line adjacent to multiline variable declarations.",
    },
    fixable: "whitespace",
    messages: {
      expected: "Add exactly one blank line next to this multiline variable declaration.",
    },
  },
  create(context) {
    function checkStatements(node) {
      const statements = node.type === "SwitchCase" ? node.consequent : node.body;

      for (let index = 0; index < statements.length - 1; index += 1) {
        const statement = statements[index];

        const isMultilineVariable = isVariableDeclaration(statement) && isMultiline(statement);

        // Other padding rules own boundaries after multiline statements.
        const isNextMultilineVariable =
          !isMultiline(statement) &&
          isVariableDeclaration(statements[index + 1]) &&
          isMultiline(statements[index + 1]);

        if (!isMultilineVariable && !isNextMultilineVariable) {
          continue;
        }

        requireBlankLineAfter({
          context,
          node: statement,
          nextNode: statements[index + 1],
          messageId: "expected",
          reportNode: isMultilineVariable ? statement : statements[index + 1],
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
