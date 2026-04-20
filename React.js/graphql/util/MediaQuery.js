import { useEffect, useState } from 'react';
import { css } from 'styled-components';

const mediaQuery = (queryTemplate, ...queryRest) => (rulesTemplate, ...rulesRest) => css`
      @media ${css(queryTemplate, ...queryRest)} {
        ${css(rulesTemplate, ...rulesRest)}
      }
    `;

const sizes = {
  mobile: 450,
  tablet: 768,
  desktop: 992,
  giant: 1170,
};

export const mobileQueryString = `(max-width: ${(sizes.desktop - 1) / 16}em)`;

export const media = {
  handheld: mediaQuery`(max-width: ${(sizes.tablet - 1) / 16}em)`,
  tablet: mediaQuery`(min-width: ${sizes.tablet / 16}em)`,
  tabletOnly: mediaQuery`(min-width: ${sizes.tablet / 16}em) and (max-width: ${
    (sizes.desktop - 1) / 16
  }em)`,
  mobile: mediaQuery`${mobileQueryString}`,
  desktop: mediaQuery`(min-width: ${sizes.desktop / 16}em)`,
  giant: mediaQuery`(min-width: ${sizes.giant / 16}em)`,
  minWidth: (pxValue) => mediaQuery`(min-width: ${pxValue / 16}em)`,
  print: mediaQuery`print`,
};

export const useMedia = (query) => {
  const matchQuery = window && window.matchMedia(query);
  const [isMatch, setIsMatch] = useState(matchQuery.matches);

  useEffect(() => {
    const handler = () => setIsMatch(matchQuery.matches);
    matchQuery.addListener(handler);
    return () => matchQuery.removeListener(handler);
  }, [query, matchQuery]);

  return isMatch;
};

// updated for 2 breakpoints
// export const useMobileMedia = () => useMedia(`(max-width: ${(sizes.tablet - 1) / 16}em)`);

export const useTabletMedia = () => useMedia(`(max-width: ${(sizes.desktop - 1) / 16}em)`);
export const useMobileMedia = () => useMedia(`(max-width: ${(sizes.mobile - 1) / 16}em)`);
// export const useMobileLandScapeMedia = () => useMedia(`(max-width: 450px)`);
export const useDesktopMedia = () => useMedia(`(min-width: ${sizes.desktop / 16}em)`);
