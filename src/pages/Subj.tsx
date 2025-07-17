import { styled } from '@linaria/react';
import { Flex, List, Skeleton, Typography } from 'antd';
import { useAtom } from 'jotai';
import { Paginator } from 'primereact/paginator';
import { Panel } from 'primereact/panel';
import { type FC, Suspense } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';
import { DefsPages } from '../components/DefsPages/DefsPages';
import { PageLayout } from '../components/PageLayout';
import { useSubj } from '../hooks/useSubj';
import { DEF_PAGE_SIZE, totalDefsCount } from '../state/definitions/atoms';

const listsBySubj: Record<string, { list: string; title: string }[]> = {
  fr: [
    {
      list: 'fr_50k',
      title: 'French 50k',
    },
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
      <Typography.Title>French</Typography.Title>
      <Typography.Title level={2}>Lists</Typography.Title>
      <List>
        {listsBySubj[subj].map(({ list, title }) => (
          <List.Item key={list}>
            <Typography.Text title="2">
              <Link to={`/subjs/${subj}/lists/${list}`}>{title}</Link>
            </Typography.Text>
          </List.Item>
        ))}
      </List>
      <Panel
        header={'Definitions'}
        footer={
          <PagesControl
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
    </PageLayout>
  );
};

export const DefSkeleton = styled(Skeleton.Button)`
  display: inline-block;
  height: 1.2em !important;
  width: 120px;
`;

export const PagesControl = styled(Paginator)`
`;
