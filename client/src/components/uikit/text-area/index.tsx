import { type Ref, useEffect, useRef } from 'react';
import {
  TextArea as AriaTextArea,
  TextField,
  type TextFieldProps,
} from 'react-aria-components';
import { mergeRefs } from 'react-merge-refs';

import { cx } from '~/styled-system/css';

import {
  type FormComponentProps,
  inputBaseStyles,
  inputWrapperStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { getValidationParams } from '../partials/validation';

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
  validationMessage,
  placeholder,
  autoResize = false,
  rows,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const validation = getValidationParams(validationMessage);

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
      isInvalid={validation.type === 'error'}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
        <AriaTextArea
          id={id}
          rows={rows}
          // eslint-disable-next-line react-compiler/react-compiler
          ref={mergeRefs([innerRef, ref])}
          placeholder={placeholder}
          className={inputBaseStyles()}
          onChange={resizeTextArea}
        />
      </InputLayout>
    </TextField>
  );
}
