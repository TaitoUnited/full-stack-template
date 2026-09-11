// Helper export functions to transform the design system tokens into Panda CSS format

export function transformNumberTokens(
  tokens: Record<string, any>,
  transformer: (value: number) => string
) {
  const transformed: Record<string, { value: string }> = {};

  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'number') {
      transformed[key] = { value: transformer(value) };
      continue;
    }

    console.error(
      `Expected a number for token "${key}", but got "${typeof value}".`
    );
  }

  return transformed;
}

export function transformColors(
  colorGroups: Record<string, Record<string, string>>
) {
  const tokens: Record<string, { value: string }> = {};

  Object.values(colorGroups).forEach(colorGroup => {
    Object.entries(colorGroup).forEach(([key, value]) => {
      tokens[key] = { value };
    });
  });

  return tokens;
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
  const transformed: Record<string, any> = {};

  for (const [key, value] of Object.entries(tokens)) {
    transformed[`$${key}`] = {
      value: {
        fontFamily: value.fontFamily,
        fontWeight: value.fontWeight,
        fontSize: `${value.fontSize / 16}rem`,
        textTransform: value.textTransform,
        letterSpacing: value.letterSpacing,
        lineHeight: value.lineHeight,
      },
    };
  }

  return transformed;
}

export function transformColorsWithScheme(tokens: {
  light: Record<string, string>;
  dark: Record<string, string>;
}) {
  const transformed: Record<
    string,
    { value: { _light: string; _dark: string } }
  > = {};

  for (const [key, value] of Object.entries(tokens.light)) {
    transformed[key] = {
      value: {
        _light: value,
        _dark: tokens.dark[key] ?? value,
      },
    };
  }

  return transformed;
}

type Shadow = {
  boxShadow: string;
  offset: { x: number; y: number };
  radius: number;
  opacity: number;
  color: { hex: string; rgba: string };
};

export function transformShadows(tokens: Record<string, Shadow>) {
  const transformed: Record<string, { value: string }> = {};

  for (const [key, value] of Object.entries(tokens)) {
    // Due to the way shadows are named in Figma we need to remove the leading
    // "shadow" from the key: "shadowLarge" -> "large"
    const name = key.replace('shadow', '').toLowerCase();
    transformed[name] = { value: value.boxShadow };
  }

  return transformed;
}
