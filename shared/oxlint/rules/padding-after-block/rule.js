// @ts-nocheck
// oxlint-disable

import { isControlFlowStatement, isMultiline, requireBlankLineAfter } from "../../spacing-utils.js";
import { createRule } from "../../utils.js";

export const rule = createRule({
  meta: {
    type: "layout",
    docs: {
      description: "Require a blank line after multiline control-flow blocks.",
    },
    fixable: "whitespace",
    messages: {
      expected: "Add exactly one blank line after this control-flow block.",
    },
  },
  create(context) {
    function checkStatements(node) {
      const statements = node.type === "SwitchCase" ? node.consequent : node.body;

      for (let index = 0; index < statements.length - 1; index += 1) {
        const statement = statements[index];

        if (!isControlFlowStatement(statement) || !isMultiline(statement)) {
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
