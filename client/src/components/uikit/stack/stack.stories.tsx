import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from './index';

const meta = {
  title: 'Stack',
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

function Box({
  children,
  index,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const odd = index && index % 2 === 0;
  return (
    <div
      style={{
        background: '#e2e8f0',
        padding: '1rem',
        margin: '1rem',
        borderRadius: '0.5rem',
        textAlign: 'center',
        height: odd ? '80px' : '100px', // Make odd boxes a bit smaller to test the alignment
        width: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

export const Default: Story = {
  args: {
    gap: '$regular',
    justify: 'center',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const ResponsiveGap: Story = {
  args: {
    gap: {
      sm: '$xxs',
      md: '$xs',
      lg: '$small',
      xl: '$medium',
      '2xl': '$large',
    },
    justify: 'center',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const Direction: Story = {
  args: {
    direction: 'column',
    gap: '$regular',
    align: 'center',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const ResponsiveDirection: Story = {
  args: {
    direction: { base: 'column', md: 'row' },
    gap: '$regular',
    justify: 'center',
    align: 'center',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const Alignment: Story = {
  args: {
    align: 'center',
    gap: '$regular',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index} index={index}>
        Box {index}
      </Box>
    )),
  },
};

export const ResponsiveAlignment: Story = {
  args: {
    align: { base: 'flex-start', xl: 'center' },
    gap: '$regular',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index} index={index}>
        Box {index}
      </Box>
    )),
  },
};

export const Justify: Story = {
  args: {
    justify: 'space-between',
    gap: '$regular',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const ResponsiveJustify: Story = {
  args: {
    align: 'center',
    justify: { base: 'space-between', xl: 'space-around' },
    gap: '$small',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const Wrap: Story = {
  args: {
    wrap: 'wrap',
    gap: '$regular',
    children: Array.from({ length: 8 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const ResponsiveWrap: Story = {
  args: {
    wrap: { base: 'nowrap', xl: 'wrap' },
    gap: '$regular',
    children: Array.from({ length: 8 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const AsElement: Story = {
  args: {
    as: 'section',
    gap: '$regular',
    children: Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
      <Box key={index}>Box {index}</Box>
    )),
  },
};

export const ComplexResponsive: Story = {
  args: {
    gap: { base: '$regular', md: '$xl', xl: '$2xl' },
    direction: { base: 'column', md: 'row' },
    align: { base: 'flex-start', md: 'center', xl: 'flex-end' },
    justify: { base: 'flex-start', md: 'space-between', xl: 'space-around' },
    wrap: { base: 'wrap', md: 'nowrap' },
    children: Array.from({ length: 8 }, (_, index) => index + 1).map(index => (
      <Box key={index} index={index}>
        Box {index}
      </Box>
    )),
  },
};
