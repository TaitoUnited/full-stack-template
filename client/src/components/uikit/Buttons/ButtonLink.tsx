import { forwardRef } from 'react';
import { mergeProps } from 'react-aria';
import { Link } from 'react-router-dom'; // eslint-disable-line no-restricted-imports
import { useLinkProps } from '~components/navigation/Link';

// TODO: fix types
const ButtonLink = forwardRef<any, any>(
  ({ linkProps, ...buttonProps }, ref) => {
    const extraProps = useLinkProps(linkProps);

    return (
      <Link
        ref={ref}
        to={linkProps.to}
        {...mergeProps(extraProps, buttonProps)}
      />
    );
  }
);

ButtonLink.displayName = 'ButtonLink';
export default ButtonLink;
