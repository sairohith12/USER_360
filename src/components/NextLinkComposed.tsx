// src/components/NextLinkComposed.tsx
import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

type NextLinkComposedProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<NextLinkProps, 'href'> & {
    to: NextLinkProps['href']; // accepts both string and UrlObject
    linkAs?: NextLinkProps['as'];
  };

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const { to, linkAs, replace, scroll, shallow, prefetch, locale, onClick, ...other } = props;

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Optional callback execution
      if (onClick) {
        onClick(event);
      }

      // If event is prevented in onClick (e.g. event.preventDefault()), stop navigation
      if (event.defaultPrevented) {
        return;
      }
    };
    return (
      <NextLink
        href={to || '/'}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        passHref
        legacyBehavior
      >
        <a ref={ref} onClick={handleClick} {...other} />
      </NextLink>
    );
  },
);

export default NextLinkComposed;
