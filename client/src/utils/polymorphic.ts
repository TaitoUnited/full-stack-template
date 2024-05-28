/**
 * Code janked: from https://github.com/nasheomirro/react-polymorphed
 * 
 * Don't worry if this code looks confusing. It's a bit of a mind-bender,
 * but it just allows us to create polymorphic components with forward refs, eg:
 * 
 * ```
 * <Stack as="ul" gap="small">
 * ```
 */

import {
  forwardRef,
  type ComponentPropsWithRef,
  type ElementType,
  type ForwardRefExoticComponent,
  type ForwardRefRenderFunction,
  type ReactElement,
} from 'react';

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

type Merge<A, B> = Omit<A, keyof B> & B;
type DistributiveMerge<A, B> = DistributiveOmit<A, keyof B> & B;

type AsProps<
  Component extends ElementType,
  PermanentProps extends object,
  ComponentProps extends object
> = DistributiveMerge<ComponentProps, PermanentProps & { as?: Component }>;

type PolymorphicWithRef<
  Default extends OnlyAs,
  Props extends object = {}, // eslint-disable-line @typescript-eslint/ban-types
  OnlyAs extends ElementType = ElementType
> = <T extends OnlyAs = Default>(
  props: AsProps<T, Props, ComponentPropsWithRef<T>>
) => ReactElement | null;

type PolyForwardComponent<
  Default extends OnlyAs,
  Props extends object = {}, // eslint-disable-line @typescript-eslint/ban-types
  OnlyAs extends ElementType = ElementType
> = Merge<
  ForwardRefExoticComponent<
    Merge<ComponentPropsWithRef<Default>, Props & { as?: Default }>
  >,
  PolymorphicWithRef<Default, Props, OnlyAs>
>;

type PolyRefFunction = <
  Default extends OnlyAs,
  Props extends object = {}, // eslint-disable-line @typescript-eslint/ban-types
  OnlyAs extends ElementType = ElementType
>(
  Component: ForwardRefRenderFunction<any, Props & { as?: OnlyAs }>
) => PolyForwardComponent<Default, Props, OnlyAs>;

export const polymorphicForwardRef = forwardRef as PolyRefFunction;
