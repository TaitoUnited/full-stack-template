import { forwardRef, ComponentProps, TextareaHTMLAttributes } from 'react';
import { useTextField } from 'react-aria';
import { TextField } from 'react-aria-components';

import {
  inputWrapperStyles,
  labelStyles,
  baseInputStyles,
  DescriptionText,
  ErrorText,
} from '../partials/common';

import { css, cx } from '~styled-system/css';

type Props = ComponentProps<typeof TextField> &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    description?: string;
    /** Passing an `errorMessage` as prop toggles the input as invalid. */
    errorMessage?: string;
  };

/**
 * Ref: https://react-spectrum.adobe.com/react-aria/TextField.html
 */
const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      label,
      description,
      errorMessage,
      placeholder,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const { inputProps, labelProps, descriptionProps, errorMessageProps } =
      useTextField(
        {
          ...rest,
          validationState: errorMessage ? 'invalid' : 'valid',
          inputElementType: 'textarea',
        },
        ref as any
      );

    return (
      <div style={style} className={cx(inputWrapperStyles, className)}>
        <label
          {...labelProps}
          className={labelStyles}
          data-required={rest.isRequired}
        >
          {label}
        </label>

        <div className={css({ position: 'relative' })}>
          {/**
           * TODO: soon there will probably be a better way to render a textarea
           * with react-aria-components: https://github.com/adobe/react-spectrum/issues/4595
           */}
          <textarea
            {...inputProps}
            ref={ref}
            placeholder={placeholder}
            className={baseInputStyles}
          />
        </div>

        {description && (
          <DescriptionText {...descriptionProps}>{description}</DescriptionText>
        )}
        {errorMessage && (
          <ErrorText {...errorMessageProps}>{errorMessage}</ErrorText>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
