import { type Ref, useEffect, useRef } from 'react';
import { type TextFieldProps } from 'react-aria-components';
import {
  TextArea as AriaTextArea,
  Label,
  TextField,
} from 'react-aria-components';
import { mergeRefs } from 'react-merge-refs';

import { cx } from '~/styled-system/css';

import { type FormComponentProps } from '../partials/common';
import {
  FormInputContainer,
  inputBaseStyles,
  inputWrapperStyles,
  labelStyles,
  useInputContext,
} from '../partials/common';

type Props = FormComponentProps<TextFieldProps> & {
  ref?: Ref<HTMLTextAreaElement>;
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
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  description,
  errorMessage,
  placeholder,
  autoResize = false,
  rows,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
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
  }, []);

  return (
    <TextField
      {...rest}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      isInvalid={!!errorMessage}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
    >
      {!!label && (
        <Label
          className={labelStyles({ labelPosition })}
          data-required={rest.isRequired}
        >
          {label}
        </Label>
      )}

      <FormInputContainer description={description} errorMessage={errorMessage}>
        <AriaTextArea
          id={id}
          rows={rows}
          // eslint-disable-next-line react-compiler/react-compiler
          ref={mergeRefs([innerRef, ref])}
          placeholder={placeholder}
          className={inputBaseStyles}
          onChange={resizeTextArea}
        />
      </FormInputContainer>
    </TextField>
  );
}
