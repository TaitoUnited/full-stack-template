// @ts-check
// oxlint-disable

import {
  isMultiline,
  requireBlankLineAfter,
} from '../../../../shared/oxlint/spacing-utils.js';
import { createRule } from '../../../../shared/oxlint/utils.js';

const STRUCTURAL_JSX_CHILD_TYPES = new Set([
  'JSXElement',
  'JSXExpressionContainer',
  'JSXFragment',
]);

export const rule = createRule({
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require a blank line after multiline structural JSX children.',
    },
    fixable: 'whitespace',
    messages: {
      expected: 'Add exactly one blank line after this multiline JSX child.',
    },
  },
  create(context) {
    function checkChildren(node) {
      if (hasMeaningfulJsxText(node.children)) {
        return;
      }

      const children = node.children.filter(child => child.type !== 'JSXText');

      for (let index = 0; index < children.length - 1; index += 1) {
        const child = children[index];

        if (!isStructuralJsxChild(child) || !isMultiline(child)) {
          continue;
        }

        requireBlankLineAfter({
          context,
          node: child,
          nextNode: children[index + 1],
          messageId: 'expected',
        });
      }
    }

    return {
      JSXElement: checkChildren,
      JSXFragment: checkChildren,
    };
  },
});

function hasMeaningfulJsxText(children) {
  return children.some(
    child => child.type === 'JSXText' && child.value.trim().length > 0
  );
}

function isStructuralJsxChild(node) {
  return STRUCTURAL_JSX_CHILD_TYPES.has(node.type);
}
