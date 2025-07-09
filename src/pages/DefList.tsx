import { PlayCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Flex, Pagination, Skeleton, Typography } from 'antd';
import { useAtom } from 'jotai';
import { type FC, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { useListId, useSubj } from '../hook/useSubj';
import { currentListAtom } from '../state/currentList/atoms';
import { DEF_PAGE_SIZE } from '../state/definitions/atoms';

const listsTitles: Record<string, string> = {
  fr_50k: '50K Most used French words',
};

export const DefList: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [list] = useAtom(currentListAtom({ subj, id: listId }));
  const [params, setParams] = useSearchParams();

  const page = +(params.get('page') ?? 1);

  const pageItems = useMemo(
    () => list.slice((page - 1) * DEF_PAGE_SIZE, page * DEF_PAGE_SIZE),
    [list, page],
  );

  const navigate = useNavigate();

  return (
    <PageLayout>
      <Typography.Title level={2}>{listsTitles[listId]}</Typography.Title>
      <Flex justify="center" gap="10px">
        <Button
          color="blue"
          icon={<PlayCircleFilled />}
          onClick={() => {
            navigate(`/subjs/${subj}/lists/${listId}/play/forward`);
          }}
        >
          Play forward
        </Button>
        <Button
          color="blue"
          icon={<ReloadOutlined />}
          onClick={() => {
            navigate(`/subjs/${subj}/lists/${listId}/play/reverse`);
          }}
        >
          Play reverse
        </Button>
      </Flex>
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
            const params = new URLSearchParams([['page', `${page}`]]);

            setParams(params);
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
