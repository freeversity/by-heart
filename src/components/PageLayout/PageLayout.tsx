import { styled } from '@linaria/react';
import { Divider, Flex, Layout } from 'antd';
import type { FC, ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { DefSearch } from '../DefSearch';
import { LogoIcon } from '../Logo/Logo';

export const PageLayout: FC<{
  className?: string;
  children: ReactNode;
  header?: ReactNode;
}> = ({ className, children }) => {
  const { subj } = useParams();
  return (
    <SLayout className={className}>
      <SHeader>
        <Flex justify="space-between">
          <Link to="/">
            <SLogo />
          </Link>
          <Divider type="vertical" orientation="center" />
          {subj && <DefSearch subj={subj} />}
        </Flex>
      </SHeader>
      <SContent>{children}</SContent>
    </SLayout>
  );
};

const SHeader = styled(Layout.Header)`
  text-align: center;
  color: #fff;
  height: 64px;
  padding-inline: 48px;
  line-height: 64px;
  background-color: #4096ff;
  position: fixed;
  width: 100%;
  z-index: 1000;
`;

const SLogo = styled(LogoIcon)``;

const SLayout = styled(Layout)`
  overflow: hidden;
  width: 'calc(50% - 8px)';
  max-width: 'calc(50% - 8px)';
  min-height: 100dvh;
`;

const SContent = styled(Layout.Content)`
  text-align: center;
  min-height: 120px;
  padding: 74px 20px 20px;
`;
