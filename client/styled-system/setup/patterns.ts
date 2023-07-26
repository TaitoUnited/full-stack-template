import { definePattern } from '@pandacss/dev';

/* Add more patterns here if needed
 * Docs: https://panda-css.com/docs/customization/patterns
 * You can copy & paste and modify the existing patterns that Panda CSS provides:
 * https://github.com/chakra-ui/panda/blob/main/packages/preset-base/src/patterns.ts
 **/

export const stack = definePattern({
  properties: {
    align: { type: 'property', value: 'alignItems' },
    justify: { type: 'property', value: 'justifyContent' },
    direction: { type: 'property', value: 'flexDirection' },
    gap: { type: 'token', value: 'spacing' },
  },
  transform(props) {
    const { align, justify, direction = 'column', gap, ...rest } = props;
    return {
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      gap,
      ...rest,
    };
  },
});
