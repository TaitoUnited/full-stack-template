type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ResponsiveBreakpoint = Breakpoint | `${Breakpoint}Down`;

type ResponsiveValues<Value> = {
  base: Value;
} & Partial<Record<ResponsiveBreakpoint, Value>>;

/**
 * A value that Panda compiles into styles for the base breakpoint and selected
 * responsive conditions. `base` is required so a visual prop always has a
 * value outside its responsive overrides.
 */
export type ResponsiveProp<Value> = Value | ResponsiveValues<Value>;

/**
 * Returns the value used outside responsive conditions when a visual prop also
 * determines stable document semantics, such as Text's default HTML element.
 */
export function getResponsiveBaseValue<Value>(
  value: ResponsiveProp<Value>
): Value {
  if (isResponsiveValues(value)) {
    return value.base;
  }

  return value;
}

function isResponsiveValues<Value>(
  value: ResponsiveProp<Value>
): value is ResponsiveValues<Value> {
  return typeof value === 'object' && value !== null && 'base' in value;
}
