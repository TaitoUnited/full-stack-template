import { forwardRef, ComponentProps, TextareaHTMLAttributes } from 'react';
import { useTextField } from 'react-aria';
import { TextField } from 'react-aria-components';
import styled from 'styled-components';

import {
  inputWrapperStyles,
  labelStyles,
  baseInputStyles,
  DescriptionText,
  ErrorText,
} from '~components/uikit/partials/common';

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
      <Wrapper style={style} className={className}>
        <Label {...labelProps} data-required={rest.isRequired}>
          {label}
        </Label>

        <InputWrapper>
          {/**
           * TODO: soon there will probably be a better way to render a textarea
           * with react-aria-components: https://github.com/adobe/react-spectrum/issues/4595
           */}
          <Input {...inputProps} ref={ref} placeholder={placeholder} />
        </InputWrapper>

        {description && (
          <DescriptionText {...descriptionProps}>{description}</DescriptionText>
        )}
        {errorMessage && (
          <ErrorText {...errorMessageProps}>{errorMessage}</ErrorText>
        )}
      </Wrapper>
    );
  }
);

const Wrapper = styled.div`
  ${inputWrapperStyles}
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.textarea`
  ${baseInputStyles}
`;

const Label = styled.label`
  ${labelStyles}
`;

TextArea.displayName = 'TextArea';
export default TextArea;
