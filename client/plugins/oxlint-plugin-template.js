// @ts-check
// oxlint-disable

import { rule as noExtraEmptyLines } from '../../shared/oxlint/rules/no-extra-empty-lines/rule.js';
import { rule as noPositionalFuncArgs } from '../../shared/oxlint/rules/no-positional-func-args/rule.js';
import { rule as paddingAfterBlock } from '../../shared/oxlint/rules/padding-after-block/rule.js';
import { rule as paddingAfterFunction } from '../../shared/oxlint/rules/padding-after-function/rule.js';
import { rule as paddingAfterMultilineStatement } from '../../shared/oxlint/rules/padding-after-multiline-statement/rule.js';
import { rule as paddingAfterMultilineVariable } from '../../shared/oxlint/rules/padding-after-multiline-variable/rule.js';
import { rule as paddingBetweenTopLevelDeclarations } from '../../shared/oxlint/rules/padding-between-top-level-declarations/rule.js';
import { createPlugin } from '../../shared/oxlint/utils.js';
import { rule as noFunctionDepsInEffect } from './rules/no-function-deps-in-effect/rule.js';
import { rule as paddingBetweenJsxSiblings } from './rules/padding-between-jsx-siblings/rule.js';

export const rules = {
  'no-extra-empty-lines': noExtraEmptyLines,
  'no-function-deps-in-effect': noFunctionDepsInEffect,
  'no-positional-func-args': noPositionalFuncArgs,
  'padding-after-block': paddingAfterBlock,
  'padding-after-function': paddingAfterFunction,
  'padding-after-multiline-statement': paddingAfterMultilineStatement,
  'padding-after-multiline-variable': paddingAfterMultilineVariable,
  'padding-between-jsx-siblings': paddingBetweenJsxSiblings,
  'padding-between-top-level-declarations': paddingBetweenTopLevelDeclarations,
};

export default createPlugin({
  name: 'full-stack-template-client',
  rules,
});
