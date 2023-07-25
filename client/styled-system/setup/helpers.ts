// Helper export functions to transform the design system tokens into Panda CSS format

export function tokenName(value: string | number) {
  return `$${value}`;
}

export function transformNumberTokens(
  tokens: Record<string, any>,
  transformer: (value: number) => string
) {
  return Object.entries(tokens).reduce<Record<string, { value: string }>>(
    (acc, [key, value]) => {
      acc[tokenName(key)] = { value: transformer(value) };
      return acc;
    },
    {}
  );
}

type TextStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  textTransform: string;
  letterSpacing: number;
  lineHeight: number;
};

export function transformTypography(tokens: Record<string, TextStyle>) {
  return Object.entries(tokens).reduce<Record<string, any>>(
    (acc, [key, value]) => {
      acc[tokenName(key)] = {
        value: {
          fontFamily: value.fontFamily,
          fontWeight: value.fontWeight,
          fontSize: `${value.fontSize / 16}rem`,
          textTransform: value.textTransform,
          letterSpacing: value.letterSpacing,
          lineHeight: value.lineHeight,
        },
      };
      return acc;
    },
    {}
  );
}

export function transformColors(tokens: {
  light: Record<string, string>;
  dark: Record<string, string>;
}) {
  return Object.entries(tokens.light).reduce((acc, [key, value]) => {
    acc[tokenName(key)] = {
      value: {
        _light: value,
        _dark: tokens.dark[key],
      },
    };
    return acc;
  }, {} as Record<string, { value: { _light: string; _dark: string } }>);
}

type Shadow = {
  boxShadow: string;
  offset: { x: number; y: number };
  radius: number;
  opacity: number;
  color: { hex: string; rgba: string };
};

export function transformShadows(tokens: Record<string, Shadow>) {
  return Object.entries(tokens).reduce((acc, [key, value]) => {
    // Due to the way shadows are named in Figma we need to remove the leading
    // "shadow" from the key: "shadowLarge" -> "large"
    const name = tokenName(key.replace('shadow', '').toLowerCase());
    acc[name] = { value: value.boxShadow };
    return acc;
  }, {} as Record<string, { value: string }>);
}
