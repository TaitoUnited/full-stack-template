import { UtilityConfig } from '@pandacss/types';
import { definePreset } from '@pandacss/dev';
import basePreset from '@pandacss/preset-base';

const tokenKeys = ['colors', 'spacing', 'sizes', 'radii', 'shadows'];

// Don't include non-standard CSS properties like `px: 10` or `mt: 10`.
// We only want to include utilities that help us map theme tokens to CSS properties
// like `padding: '$large'` or `borderRadius: '$small'`.
const utilities = Object.entries(basePreset.utilities).reduce<UtilityConfig>(
  (acc, [key, value]) => {
    if (
      tokenKeys.includes(value?.values as any) &&
      !value?.property &&
      !value?.transform
    ) {
      acc[key] = {
        className: value?.className,
        values: value?.values,
      };
    }

    return acc;
  },
  {}
);

export const preset = definePreset({ utilities });
