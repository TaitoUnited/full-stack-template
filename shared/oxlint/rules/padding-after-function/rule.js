// @ts-nocheck
// oxlint-disable

import {
  isClassMethod,
  isFunctionDeclaration,
  isFunctionOverloadPair,
  isMethodOverloadPair,
  isObjectMethod,
  requireBlankLineAfter,
} from "../../spacing-utils.js";
import { createRule } from "../../utils.js";

export const rule = createRule({
  meta: {
    type: "layout",
    docs: {
      description: "Require a blank line after function definitions.",
    },
    fixable: "whitespace",
    messages: {
      expected: "Add exactly one blank line after this function definition.",
    },
  },
  create(context) {
    function checkStatements(node) {
      checkList({
        context,
        items: node.body,
        isFunction: isFunctionDeclaration,
        keepTogether: isFunctionOverloadPair,
      });
    }

    function checkClass(node) {
      checkList({
        context,
        items: node.body,
        isFunction: isClassMethod,
        keepTogether: isMethodOverloadPair,
      });
    }

    function checkObject(node) {
      checkList({
        context,
        items: node.properties,
        isFunction: isObjectMethod,
      });
    }

    return {
      Program: checkStatements,
      BlockStatement: checkStatements,
      StaticBlock: checkStatements,
      TSModuleBlock: checkStatements,
      ClassBody: checkClass,
      ObjectExpression: checkObject,
    };
  },
});

function checkList({ context, items, isFunction, keepTogether = () => false }) {
  for (let index = 0; index < items.length - 1; index += 1) {
    const node = items[index];
    const nextNode = items[index + 1];

    if (!isFunction(node) || keepTogether(node, nextNode)) {
      continue;
    }

    requireBlankLineAfter({
      context,
      node,
      nextNode,
      messageId: "expected",
    });
  }
}
