import { styled } from '@linaria/react';
import { Layout } from 'antd';
import type { FC, ReactNode } from 'react';
import { useViewport } from '../../hooks/useViewport';

export const Footer: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  const { height, offsetTop } = useViewport();

  return (
    <SFooter
      className={className}
      style={{ '--viewport-bottom': `${height + offsetTop}px` }}
    >
      {children}
    </SFooter>
  );
};

const SFooter = styled(Layout.Footer)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  height: 64px;
  background-color: #4096ff;
  position: fixed;
  padding: 10px;
  top: 100%;
  top: var(--viewport-bottom);
  transform: translateY(-100%);
  width: 100%;
  z-index: 1000;
`;
