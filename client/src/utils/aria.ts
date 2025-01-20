const propsMap = {
  onClick: 'onPress',
  onMouseDown: 'onPressStart',
  onMouseUp: 'onPressEnd',
  onMouseEnter: 'onHoverStart',
  onMouseLeave: 'onHoverEnd',
} as const;

/**
 * Maps regular DOM event handler props to React Aria supported props, eg:
 *
 * ```txt
 * onClick -> onPress
 * onMouseDown -> onPressStart
 * onMouseUp -> onPressEnd
 * onMouseUp -> onPressUp
 * onMouseEnter -> onHoverStart
 * onMouseLeave -> onHoverEnd
 * ```
 */
export function mapToAriaProps<T extends Record<string, any>>(props: T) {
  const ariaProps: any = { ...props };

  for (const [key, value] of Object.entries(propsMap)) {
    if (props[key]) {
      ariaProps[value] = props[key];
      delete ariaProps[key];
    }
  }

  return ariaProps;
}
