import type { FC } from 'react';

import cx from 'classnames';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { Colors } from '../../consts/colors';

export const LogoIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={cx(logoCx, className)}>
      <span>f</span>
      <SLabel>❤️</SLabel>
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
    letter-spacing: -2px;
    text-transform: lowercase;
    line-height: 1;
`;

const SLabel = styled.span`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0, -45%);
    font-family: "Rambla", sans-serif;
    font-weight: 400;
    font-size: 22px;
    letter-spacing: 0;
    color: red;
    font-style: normal;
    text-shadow: 0 0 0 white;
`;
