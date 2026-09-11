// @ts-nocheck
// oxlint-disable

import { disallowBoundaryBlankLine, disallowMultipleBlankLines } from "../../spacing-utils.js";
import { createRule, getSourceCode } from "../../utils.js";

export const rule = createRule({
  meta: {
    type: "layout",
    docs: {
      description: "Disallow multiple blank lines and blank lines at container boundaries.",
    },
    fixable: "whitespace",
    messages: {
      boundary: "Remove the blank line at this container boundary.",
      multiple: "Use at most one consecutive blank line.",
    },
  },
  create(context) {
    const boundaryRanges = [];

    function checkProgram(node) {
      disallowMultipleBlankLines({
        context,
        program: node,
        boundaryRanges,
        messageId: "multiple",
      });
    }

    function checkBody(node) {
      checkDelimitedContainer({
        context,
        node,
        children: node.body,
        boundaryRanges,
      });
    }

    function checkTypeLiteral(node) {
      checkDelimitedContainer({
        context,
        node,
        children: node.members,
        boundaryRanges,
      });
    }

    function checkProperties(node) {
      checkDelimitedContainer({
        context,
        node,
        children: node.properties,
        boundaryRanges,
      });
    }

    function checkElements(node) {
      checkDelimitedContainer({
        context,
        node,
        children: node.elements.filter(Boolean),
        boundaryRanges,
      });
    }

    function checkJsx(node) {
      if (hasMeaningfulJsxText(node.children)) {
        return;
      }

      const children = node.children.filter((child) => child.type !== "JSXText");

      const openingEnd =
        node.type === "JSXElement" ? node.openingElement.range[1] : node.openingFragment.range[1];

      const closingStart =
        node.type === "JSXElement" ? node.closingElement?.range[0] : node.closingFragment.range[0];

      if (closingStart === undefined) {
        return;
      }

      disallowBoundaryBlankLine({
        context,
        container: node,
        firstNode: children[0],
        lastNode: children.at(-1),
        openingEnd,
        closingStart,
        boundaryRanges,
        messageId: "boundary",
      });
    }

    return {
      "Program:exit": checkProgram,
      BlockStatement: checkBody,
      ClassBody: checkBody,
      ObjectExpression: checkProperties,
      ArrayExpression: checkElements,
      StaticBlock: checkBody,
      TSInterfaceBody: checkBody,
      TSModuleBlock: checkBody,
      TSTypeLiteral: checkTypeLiteral,
      JSXElement: checkJsx,
      JSXFragment: checkJsx,
    };
  },
});

function checkDelimitedContainer({ context, node, children, boundaryRanges }) {
  if (children.length === 0) {
    return;
  }

  const sourceCode = getSourceCode(context);
  const openingToken = sourceCode.getFirstToken(node);
  const closingToken = sourceCode.getLastToken(node);

  disallowBoundaryBlankLine({
    context,
    container: node,
    firstNode: children[0],
    lastNode: children.at(-1),
    openingEnd: openingToken.range[1],
    closingStart: closingToken.range[0],
    boundaryRanges,
    messageId: "boundary",
  });
}

function hasMeaningfulJsxText(children) {
  return children.some((child) => child.type === "JSXText" && child.value.trim().length > 0);
}
