import type { FC } from 'react';

import cx from 'classnames';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { Colors } from '../../consts/colors';

export const LogoIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={cx(logoCx, className)}>
      <span>f</span>
      <SLabel>♥</SLabel>
      {/* <span>❤️</span> */}
    </span>
  );
};

const logoCx = css`
    padding: 10px 15px;
    position: relative;
    font-family: "Rambla", sans-serif;
    font-weight: 700;
    font-style: italic;
    color: ${Colors.logoYellow};
    text-shadow: 3px 1px 0 ${Colors.logoBlue};
    font-size: 32px;
    letter-spacing: -4px;
    text-transform: lowercase;
    line-height: 1;
`;

const SLabel = styled.span`
    font-size: 20px;
    color: red;
    font-style: italic;
    text-shadow: 3px 0px 0 ${Colors.logoYellow};
`;
