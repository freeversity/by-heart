import { styled } from '@linaria/react';
import { Flex, List, Skeleton } from 'antd';
import { useAtom } from 'jotai';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Paginator } from 'primereact/paginator';
import { Panel } from 'primereact/panel';
import { type FC, Suspense } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';
import { DefsPages } from '../components/DefsPages/DefsPages';
import { PageLayout } from '../components/PageLayout';
import { Colors } from '../consts/colors';
import { useSubj } from '../hooks/useSubj';
import { Container } from '../layout/Container';
import { DEF_PAGE_SIZE, totalDefsCount } from '../state/definitions/atoms';

const listsBySubj: Record<
  string,
  { list: string; title: string; description: string }[]
> = {
  fr: [
    {
      list: 'fr_50k',
      title: 'French 50k',
      description: '50K Most used French words',
    },
    // {
    //   list: 'tcf',
    //   title: 'TCF Tests',
    //   description: 'TCF tests for practice',
    // },
  ],
};

export const Subj: FC = () => {
  const subj = useSubj();

  const [params, setParams] = useSearchParams();

  const page = +(params.get('page') ?? 1);

  const [totalPages] = useAtom(totalDefsCount(subj));

  if (!(subj in listsBySubj) || !listsBySubj[subj])
    return <Navigate to="/subjs" />;

  return (
    <PageLayout>
      <Content>
        <h1>French</h1>
        <SubjList header={'Lists'}>
          {listsBySubj[subj].map(({ list, title, description }) => (
            <ListCard key={list} title={title}>
              <p>📝 {description}</p>
              <Link
                className="p-button font-bold"
                to={`/subjs/${subj}/lists/${list}`}
              >
                Let's go!
              </Link>
            </ListCard>
          ))}
        </SubjList>
        <Panel
          header={'Definitions'}
          footer={
            <Paginator
              first={(page - 1) * DEF_PAGE_SIZE}
              rows={DEF_PAGE_SIZE}
              totalRecords={totalPages}
              // ={page}
              onPageChange={({ page }) => {
                const params = new URLSearchParams([['page', `${page + 1}`]]);

                setParams(params);
              }}
            />
          }
        >
          <Suspense
            fallback={
              <Flex wrap="wrap" gap="5px 15px">
                {new Array(DEF_PAGE_SIZE).fill(null).map((_item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: no sorting
                  <DefSkeleton key={index} />
                ))}
              </Flex>
            }
          >
            <DefsPages />
          </Suspense>
        </Panel>
      </Content>
    </PageLayout>
  );
};

export const SubjList = styled(Panel)`
  .p-panel-content {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const DefSkeleton = styled(Skeleton.Button)`
  display: inline-block;
  height: 1.2em !important;
  width: 120px;
`;

export const Content = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 100px;
`;

export const ListCard = styled(Card)`
  width: 0;
  flex-grow: 1;
  min-width: 400px;
`;
