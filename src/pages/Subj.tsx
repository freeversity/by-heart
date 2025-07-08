import { styled } from '@linaria/react';
import { Flex, List, Pagination, Skeleton, Typography } from 'antd';
import { useAtom } from 'jotai';
import { type FC, Suspense } from 'react';
import { Link, Navigate } from 'react-router';
import { DefsPages } from '../components/DefsPages/DefsPages';
import { PageLayout } from '../components/PageLayout';
import { useSubj } from '../hook/useSubj';
import {
  DEF_PAGE_SIZE,
  defsPage,
  totalDefsCount,
} from '../state/definitions/atoms';

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

  const [defPage, setDefPage] = useAtom(defsPage);

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
      <Typography.Title level={2}>Definitions</Typography.Title>

      <Suspense
        fallback={
          <Flex wrap="wrap" gap="5px 15px">
            {new Array(100).fill(null).map((_item, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: no sorting
              <DefSkeleton key={index} />
            ))}
          </Flex>
        }
      >
        <DefsPages />
      </Suspense>
      <Flex justify="center">
        <PagesControl
          pageSize={DEF_PAGE_SIZE}
          showSizeChanger={false}
          total={totalPages}
          current={defPage}
          onChange={(page) => {
            setDefPage(page);
          }}
        />
      </Flex>
    </PageLayout>
  );
};

export const DefSkeleton = styled(Skeleton.Button)`
  display: inline-block;
  height: 1.2em !important;
  width: 120px;
`;

export const PagesControl = styled(Pagination)`
  padding: 20px 0;
`;
