import { styled } from '@linaria/react';
import { Flex, Layout } from 'antd';
import type { FC, ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { DefSearch } from '../DefSearch';
import { LogoIcon } from '../Logo/Logo';

export const PageLayout: FC<{
  className?: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}> = ({ className, children, header, footer }) => {
  const { subj } = useParams();

  return (
    <SLayout className={className} data-footer={!!footer}>
      <SHeader>
        <HeaderContent justify="space-between">
          <Link to="/">
            <SLogo />
          </Link>
          {header}
          {subj && <DefSearch subj={subj} />}
        </HeaderContent>
      </SHeader>
      <SContent>{children}</SContent>
      {footer && <SFooter>{footer}</SFooter>}
    </SLayout>
  );
};

const SLayout = styled(Layout)`
  overflow: hidden;
  width: 'calc(50% - 8px)';
  max-width: 'calc(50% - 8px)';
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

`;
const SHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: center;
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
const HeaderContent = styled(Flex)`
  width: 100%;
`;

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
  bottom: 0;
  width: 100%;
  z-index: 1000;
`;

const SContent = styled(Layout.Content)`
  text-align: center;
  min-height: 120px;
  padding: 74px 20px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  
  [data-footer=true] & {
    padding-bottom: 74px;
  }
`;
