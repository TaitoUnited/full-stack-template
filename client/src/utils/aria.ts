const propsMap = {
  onClick: 'onPress',
  onMouseDown: 'onPressStart',
  onMouseUp: 'onPressEnd',
  onMouseEnter: 'onHoverStart',
  onMouseLeave: 'onHoverEnd',
} as const;

type PropsMap = typeof propsMap;
type PropsMapKey = keyof PropsMap;

/**
 * Maps regular DOM event handler props to React Aria supported props, eg:
 *
 * ```txt
 * onClick -> onPress
 * onMouseDown -> onPressStart
 * onMouseUp -> onPressEnd
 * onMouseEnter -> onHoverStart
 * onMouseLeave -> onHoverEnd
 * ```
 */
export function mapToAriaProps<T extends Record<string, unknown>>(props: T) {
  const ariaProps: Omit<T, PropsMapKey> &
    Partial<Record<PropsMap[PropsMapKey], T[PropsMapKey]>> = {
    ...props,
  };

  for (const [key, value] of Object.entries(propsMap)) {
    if (props[key]) {
      // @ts-expect-error: TypeScript doesn't know that `value` is a key of `ariaProps`
      ariaProps[value] = props[key];
      delete ariaProps[key];
    }
  }

  return ariaProps;
}
