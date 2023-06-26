import { clamp } from './fn';

type RGB = {
  r: number;
  g: number;
  b: number;
};

const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const fadeColor = (color: string, fade: number) => {
  const { r, g, b } = hexToRgb(color) as RGB;
  return `rgba(${r}, ${g}, ${b}, ${clamp(fade, 0, 1)})`;
};
