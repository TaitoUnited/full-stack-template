// oxlint-disable typescript/no-unsafe-assignment -- No way to get proper types for the pattern transform functions...
import { definePattern } from '@pandacss/dev';

export const stackPattern = definePattern({
  jsx: ['Stack'],
  properties: {
    wrap: { type: 'property', value: 'flexWrap' },
    grow: { type: 'property', value: 'flexGrow' },
  },
  transform(props: Record<string, any>, { map }) {
    const {
      align,
      direction = 'row',
      gap,
      grow,
      justify,
      wrap,
      ...rest
    } = props;

    return {
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
      flexGrow: grow,
      gap: map(gap, value => `$${value}`),
      ...rest,
    };
  },
});

export const textPattern = definePattern({
  jsx: ['Text'],
  properties: {
    variant: { type: 'string' },
  },
  transform(props: Record<string, any>, { map }) {
    const { variant, ...rest } = props;

    return {
      textStyle: map(variant, value => `$${value}`),
      ...rest,
    };
  },
});
