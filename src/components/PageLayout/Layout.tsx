import { styled } from '@linaria/react';
import { Layout as AntdLayout } from 'antd';
import type { FC, ReactNode } from 'react';
import { useViewport } from '../../hooks/useViewport';

export const Layout: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  const { height } = useViewport();

  return (
    <SHeader
      className={className}
      style={{ '--viewport-height': `${height}px` }}
    >
      {children}
    </SHeader>
  );
};

const SHeader = styled(AntdLayout)`
  overflow: hidden;
  min-height: 100dvh;
  min-height: var(--viewport-height, 100dvh);
  display: flex;
  flex-direction: column;
`;
