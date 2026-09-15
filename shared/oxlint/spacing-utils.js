// @ts-nocheck
// oxlint-disable
import { getSourceCode } from "./utils.js";

const LINE_BREAK_PATTERN = /\r\n|\n|\r/g;
const CONTROL_FLOW_STATEMENT_TYPES = new Set([
  "DoWhileStatement",
  "ForInStatement",
  "ForOfStatement",
  "ForStatement",
  "IfStatement",
  "SwitchStatement",
  "TryStatement",
  "WhileStatement",
  "WithStatement",
]);
const CLASS_METHOD_TYPES = new Set([
  "MethodDefinition",
  "PropertyDefinition",
  "TSAbstractMethodDefinition",
]);

/**
 * Report a sibling boundary that does not contain exactly one blank line.
 * Comments on the previous line stay with the previous node. Other comments
 * stay with the following node.
 */
export function requireBlankLineAfter({ context, node, nextNode, messageId, reportNode = node }) {
  const sourceCode = getSourceCode(context);

  const { endAnchor, startAnchor } = getCommentAwareBoundary({
    sourceCode,
    node,
    nextNode,
  });

  const gap = sourceCode.text.slice(endAnchor.range[1], startAnchor.range[0]);

  // The global no-extra-empty-lines rule owns excessive padding. This rule
  // only reports a missing blank line, avoiding duplicate diagnostics.
  if (!isWhitespaceOnly(gap) || countLineBreaks(gap) >= 2) {
    return;
  }

  context.report({
    node: reportNode,
    messageId,
    fix(fixer) {
      return fixer.replaceTextRange(
        [endAnchor.range[1], startAnchor.range[0]],
        createGap({
          lineBreak: getLineBreak(sourceCode.text),
          lineBreakCount: 2,
          indentation: getIndentation({
            sourceText: sourceCode.text,
            offset: startAnchor.range[0],
            column: startAnchor.loc.start.column,
          }),
        }),
      );
    },
  });
}

/**
 * Report blank lines immediately inside a delimited container.
 */
export function disallowBoundaryBlankLine({
  context,
  container,
  firstNode,
  lastNode,
  openingEnd,
  closingStart,
  boundaryRanges,
  messageId,
}) {
  const sourceCode = getSourceCode(context);

  if (firstNode) {
    const startAnchor = getLeadingCommentAnchor({
      sourceCode,
      previousEnd: openingEnd,
      node: firstNode,
    });

    reportExtraBoundaryLine({
      context,
      container,
      sourceCode,
      start: openingEnd,
      end: startAnchor.range[0],
      indentationOffset: startAnchor.range[0],
      messageId,
    });
    boundaryRanges.push([openingEnd, startAnchor.range[0]]);
  }

  if (lastNode) {
    const endAnchor = getTrailingCommentAnchor({
      sourceCode,
      node: lastNode,
      nextStart: closingStart,
    });

    reportExtraBoundaryLine({
      context,
      container,
      sourceCode,
      start: endAnchor.range[1],
      end: closingStart,
      indentationOffset: closingStart,
      messageId,
    });

    boundaryRanges.push([endAnchor.range[1], closingStart]);
  }
}

/**
 * Report every whitespace-only token gap containing more than one blank line.
 */
export function disallowMultipleBlankLines({ context, program, boundaryRanges, messageId }) {
  const sourceCode = getSourceCode(context);
  const tokens = sourceCode.getTokens(program);
  const comments = sourceCode.getAllComments();
  const syntax = [...tokens, ...comments].sort((left, right) => left.range[0] - right.range[0]);

  for (let index = 0; index < syntax.length - 1; index += 1) {
    const previous = syntax[index];
    const next = syntax[index + 1];
    const range = [previous.range[1], next.range[0]];
    const gap = sourceCode.text.slice(previous.range[1], next.range[0]);

    if (
      isWithinBoundary({ range, boundaryRanges }) ||
      !isWhitespaceOnly(gap) ||
      countLineBreaks(gap) <= 2
    ) {
      continue;
    }

    context.report({
      node: program,
      loc: {
        start: previous.loc.end,
        end: next.loc.start,
      },
      messageId,
      fix(fixer) {
        return fixer.replaceTextRange(
          [previous.range[1], next.range[0]],
          createGap({
            lineBreak: getLineBreak(sourceCode.text),
            lineBreakCount: 2,
            indentation: getIndentation({
              sourceText: sourceCode.text,
              offset: next.range[0],
              column: next.loc.start.column,
            }),
          }),
        );
      },
    });
  }
}

function isWithinBoundary({ range, boundaryRanges }) {
  return boundaryRanges.some((boundary) => range[0] >= boundary[0] && range[1] <= boundary[1]);
}

export function isMultiline(node) {
  return node.loc.start.line < node.loc.end.line;
}

export function unwrapExport(node) {
  if (
    (node.type === "ExportNamedDeclaration" || node.type === "ExportDefaultDeclaration") &&
    node.declaration
  ) {
    return node.declaration;
  }

  return node;
}

export function isFunctionDeclaration(node) {
  const declaration = unwrapExport(node);
  return declaration.type === "FunctionDeclaration" || declaration.type === "TSDeclareFunction";
}

export function isVariableDeclaration(node) {
  return unwrapExport(node).type === "VariableDeclaration";
}

export function isTypeAliasDeclaration(node) {
  return unwrapExport(node).type === "TSTypeAliasDeclaration";
}

export function isImportDeclaration(node) {
  return node.type === "ImportDeclaration";
}

export function isExportListDeclaration(node) {
  return (
    node.type === "ExportAllDeclaration" ||
    (node.type === "ExportNamedDeclaration" && !node.declaration)
  );
}

export function isDirective(node) {
  return node.type === "ExpressionStatement" && Boolean(node.directive);
}

export function isDeclaration(node) {
  const declaration = unwrapExport(node);
  return declaration.type.endsWith("Declaration") || declaration.type === "TSDeclareFunction";
}

export function isControlFlowStatement(node) {
  const statement = unwrapExport(node);
  return CONTROL_FLOW_STATEMENT_TYPES.has(statement.type);
}

export function isFunctionOverloadPair(left, right) {
  const leftDeclaration = unwrapExport(left);
  const rightDeclaration = unwrapExport(right);

  if (!isFunctionDeclaration(left) || !isFunctionDeclaration(right)) {
    return false;
  }

  return getFunctionName(leftDeclaration) === getFunctionName(rightDeclaration);
}

export function isObjectMethod(node) {
  return (
    node.type === "Property" && (node.method === true || node.value?.type === "FunctionExpression")
  );
}

export function isClassMethod(node) {
  return CLASS_METHOD_TYPES.has(node.type) && Boolean(node.value?.type?.includes("Function"));
}

export function isMethodOverloadPair(left, right) {
  if (!isMethodLike(left) || !isMethodLike(right)) {
    return false;
  }

  return getMemberName(left) === getMemberName(right);
}

function getFunctionName(node) {
  return node.id?.name;
}

function getMemberName(node) {
  if (node.key?.type === "Identifier") {
    return node.key.name;
  }

  if (node.key?.type === "Literal") {
    return String(node.key.value);
  }
}

function isMethodLike(node) {
  return isClassMethod(node) || node.type === "TSMethodSignature";
}

function getCommentAwareBoundary({ sourceCode, node, nextNode }) {
  const endAnchor = getTrailingCommentAnchor({
    sourceCode,
    node,
    nextStart: nextNode.range[0],
  });

  return {
    endAnchor,
    startAnchor: getLeadingCommentAnchor({
      sourceCode,
      previousEnd: endAnchor.range[1],
      node: nextNode,
    }),
  };
}

function getTrailingCommentAnchor({ sourceCode, node, nextStart }) {
  const trailingToken = sourceCode.getTokenAfter(node);
  const hasTrailingDelimiter =
    trailingToken && trailingToken.range[0] < nextStart && [",", ";"].includes(trailingToken.value);

  const comments = sourceCode
    .getCommentsAfter(node)
    .filter((comment) => comment.range[0] < nextStart);

  let anchor = hasTrailingDelimiter ? trailingToken : node;

  for (const comment of comments) {
    if (comment.loc.start.line !== anchor.loc.end.line) {
      break;
    }

    anchor = comment;
  }

  return anchor;
}

function getLeadingCommentAnchor({ sourceCode, previousEnd, node }) {
  const comments = sourceCode
    .getCommentsBefore(node)
    .filter((comment) => comment.range[0] >= previousEnd);

  return comments[0] ?? node;
}

function reportExtraBoundaryLine({
  context,
  container,
  sourceCode,
  start,
  end,
  indentationOffset,
  messageId,
}) {
  const gap = sourceCode.text.slice(start, end);

  if (!isWhitespaceOnly(gap) || countLineBreaks(gap) <= 1) {
    return;
  }

  context.report({
    node: container,
    messageId,
    fix(fixer) {
      return fixer.replaceTextRange(
        [start, end],
        createGap({
          lineBreak: getLineBreak(sourceCode.text),
          lineBreakCount: 1,
          indentation: getIndentation({
            sourceText: sourceCode.text,
            offset: indentationOffset,
            column: sourceCode.getLocFromIndex(indentationOffset).column,
          }),
        }),
      );
    },
  });
}

function createGap({ lineBreak, lineBreakCount, indentation }) {
  return lineBreak.repeat(lineBreakCount) + indentation;
}

function countLineBreaks(value) {
  return value.match(LINE_BREAK_PATTERN)?.length ?? 0;
}

function getLineBreak(sourceText) {
  return sourceText.includes("\r\n") ? "\r\n" : "\n";
}

function getIndentation({ sourceText, offset, column }) {
  const lineStart = Math.max(
    sourceText.lastIndexOf("\n", offset - 1),
    sourceText.lastIndexOf("\r", offset - 1),
  );

  const prefix = sourceText.slice(lineStart + 1, offset);

  return /^[\t ]*$/.test(prefix) ? prefix : " ".repeat(column);
}

function isWhitespaceOnly(value) {
  return /^[\t \r\n]*$/.test(value);
}
