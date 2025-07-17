import { styled } from '@linaria/react';
import { Flex, Layout } from 'antd';
import type { FC, ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { DefSearch } from '../DefSearch';
import { LogoIcon } from '../Logo/Logo';
import { Footer } from './Footer';
import { Header } from './Header';

export const PageLayout: FC<{
  className?: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}> = ({ className, children, header, footer }) => {
  const { subj } = useParams();

  return (
    <SLayout className={className} data-footer={!!footer}>
      <Header>
        <HeaderContent justify="space-between">
          <Link to="/">
            <SLogo />
          </Link>
          {header}
          {subj && <Search subj={subj} />}
        </HeaderContent>
      </Header>
      <SContent>{children}</SContent>
      {footer && <Footer>{footer}</Footer>}
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

const Search = styled(DefSearch)`
  @media (max-width: 800px) {
    max-width: 40%;
  }
`;

const SLogo = styled(LogoIcon)``;
const HeaderContent = styled(Flex)`
  width: 100%;
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
