import { ComponentProps, type Ref, useRef, useEffect } from 'react';
import mergeRefs from 'react-merge-refs';

import {
  TextArea as AriaTextArea,
  TextField,
  Label,
} from 'react-aria-components';

import {
  inputWrapperStyles,
  labelStyles,
  inputBaseStyles,
  DescriptionText,
  ErrorText,
} from '../partials/common';

import { cx } from '~styled-system/css';

type Props = ComponentProps<typeof TextField> & {
  ref?: Ref<HTMLTextAreaElement>;
  label: string;
  description?: string;
  /** Passing an `errorMessage` as prop toggles the input as invalid. */
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  /** If true, the textarea will resize automatically based on its content. */
  autoResize?: boolean;
  rows?: number;
};

/**
 * Ref: https://react-spectrum.adobe.com/react-aria/TextField.html#textarea
 */
export function TextArea({
  ref,
  id,
  label,
  description,
  errorMessage,
  placeholder,
  autoResize = false,
  rows,
  ...rest
}: Props) {
  const innerRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextArea() {
    if (innerRef.current && autoResize) {
      innerRef.current.style.height = 'auto';
      innerRef.current.style.height = innerRef.current.scrollHeight + 'px';
    }
  }

  // Resize the textarea on mount if autoResize is enabled
  useEffect(() => {
    if (autoResize) {
      resizeTextArea();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TextField
      {...rest}
      className={cx(inputWrapperStyles, rest.className)}
      isInvalid={!!errorMessage}
    >
      <Label className={labelStyles} data-required={rest.isRequired}>
        {label}
      </Label>

      <AriaTextArea
        id={id}
        rows={rows}
        ref={ref ? mergeRefs([innerRef, ref]) : innerRef}
        placeholder={placeholder}
        className={inputBaseStyles}
        onChange={resizeTextArea}
      />

      {!!description && <DescriptionText>{description}</DescriptionText>}
      {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </TextField>
  );
}
