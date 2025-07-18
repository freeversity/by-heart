import { styled } from '@linaria/react';
import { Layout } from 'antd';
import type { FC, ReactNode } from 'react';
import { Colors } from '../../consts/colors';
import { useViewport } from '../../hooks/useViewport';

export const Header: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  const { offsetTop } = useViewport();

  return (
    <SHeader
      className={className}
      style={{ '--viewport-top': `${offsetTop}px` }}
    >
      {children}
    </SHeader>
  );
};

const SHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  height: 64px;
  line-height: 64px;
  background-color: ${Colors.primary};
  position: fixed;
  top: 0;
  top: var(--viewport-top);
  width: 100%;
  z-index: 1000;
  padding: 0 40px;
  
  @media (max-width: 800px) {
    padding:0  10px;
  }
`;
