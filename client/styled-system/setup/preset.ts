import { UtilityConfig } from '@pandacss/types';
import { definePreset } from '@pandacss/dev';
import basePreset from '@pandacss/preset-base';

const tokenKeys = ['colors', 'spacing', 'sizes', 'radii', 'shadows'];

// Sizing utilities are defined in a way in the base preset that it is not possible
// to detect them and remove the ones that don't map to theme tokens.
// So we need to define them manually and re-add to the utilities object.
// Sizing utils are copied from here: https://github.com/chakra-ui/panda/blob/main/packages/preset-base/src/utilities/sizing.ts
const sizingUtils = {
  width: { className: 'w', values: 'sizes' },
  inlineSize: { className: 'w', values: 'sizes' },
  minWidth: { className: 'min-w', values: 'sizes' },
  minInlineSize: { className: 'min-w', values: 'sizes' },
  maxWidth: { className: 'max-w', values: 'sizes' },
  maxInlineSize: { className: 'max-w', values: 'sizes' },
  height: { className: 'h', values: 'sizes' },
  blockSize: { className: 'h', values: 'sizes' },
  minHeight: { className: 'min-h', values: 'sizes' },
  minBlockSize: { className: 'min-h', values: 'sizes' },
  maxHeight: { className: 'max-h', values: 'sizes' },
  maxBlockSize: { className: 'max-b', values: 'sizes' },
};

// Don't include non-standard CSS properties like `px: 10` or `mt: 10`.
// We only want to include utilities that help us map theme tokens to CSS properties
// like `padding: '$large'` or `borderRadius: '$small'`.
const baseUtilities = Object.entries(
  basePreset.utilities
).reduce<UtilityConfig>((acc, [key, value]) => {
  if (!value || !value.values || typeof value.values !== 'string') return acc;

  if (tokenKeys.includes(value.values) && !value.transform) {
    acc[key] = {
      className: value.className,
      values: value.values,
    };
  }

  return acc;
}, {});

export const preset = definePreset({
  utilities: { ...baseUtilities, ...sizingUtils },
});
