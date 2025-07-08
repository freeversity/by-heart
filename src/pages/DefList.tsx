import { styled } from '@linaria/react';
import { Flex, Pagination, Skeleton, Typography } from 'antd';
import { useAtom } from 'jotai';
import { type FC, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { useListId, useSubj } from '../hook/useSubj';
import { currentListAtom } from '../state/currentList/atoms';
import { DEF_PAGE_SIZE } from '../state/definitions/atoms';

export const DefList: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [page, setPage] = useState(1);

  const [list] = useAtom(currentListAtom({ subj, id: listId }));

  const pageItems = useMemo(
    () => list.slice((page - 1) * DEF_PAGE_SIZE, page * DEF_PAGE_SIZE),
    [list, page],
  );

  return (
    <PageLayout>
      <Typography.Title>French</Typography.Title>
      <Typography.Title level={2}>Lists</Typography.Title>
      <Typography.Title level={2}>Definitions</Typography.Title>

      <Flex wrap="wrap" gap="5px 15px">
        {pageItems.map((def) => (
          <WordLink
            key={def}
            to={`/subjs/${subj}/defs/${encodeURIComponent(def)}`}
          >
            {def}
          </WordLink>
        ))}
      </Flex>
      <Flex justify="center">
        <PagesControl
          pageSize={DEF_PAGE_SIZE}
          showSizeChanger={false}
          total={list.length}
          current={page}
          onChange={(page) => {
            setPage(page);
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

const WordLink = styled(Link)`
    text-decoration: underline;
`;
