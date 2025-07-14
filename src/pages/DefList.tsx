import {
  EditOutlined,
  PlayCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Flex, Pagination, Typography } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAtom } from 'jotai';
import { type FC, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { SubjShortStats } from '../components/SubjShortStats';
import { TermLink } from '../components/TermLink/TermLink';
import { db } from '../db';
import { useListId, useSubj } from '../hooks/useSubj';
import { currentListAtom } from '../state/currentList/atoms';
import { DEF_PAGE_SIZE } from '../state/definitions/atoms';
import { formatDuration } from '../utils/formatDuration';

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

  const today = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    return new Date(year, month, day);
  }, []);

  const forwardTimes = useLiveQuery(() =>
    db.durations
      .where({ mode: 'forward' })
      .and(({ timestamp }) => timestamp > +today)
      .toArray(),
  );

  const forwarwardDur = useMemo(
    () =>
      formatDuration(
        forwardTimes?.reduce((duration, item) => duration + item.duration, 0) ??
          0,
      ),
    [forwardTimes],
  );

  const reverseTimes = useLiveQuery(() =>
    db.durations
      .where({ mode: 'reverse' })
      .and(({ timestamp }) => timestamp > +today)
      .toArray(),
  );

  const reverseDur = useMemo(
    () =>
      formatDuration(
        reverseTimes?.reduce((duration, item) => duration + item.duration, 0) ??
          0,
      ),
    [reverseTimes],
  );

  const spellTimes = useLiveQuery(() =>
    db.durations
      .where({ mode: 'spelling' })
      .and(({ timestamp }) => timestamp > +today)
      .toArray(),
  );

  const spellDur = useMemo(
    () =>
      formatDuration(
        spellTimes?.reduce((duration, item) => duration + item.duration, 0) ??
          0,
      ),
    [spellTimes],
  );

  const navigate = useNavigate();

  return (
    <PageLayout>
      <Typography.Title level={2}>{listsTitles[listId]}</Typography.Title>
      <Stats gap="20px" justify="center" align="center">
        <SubjShortStats subj={subj} list={list} mode="forward" />

        <div>
          {!!forwarwardDur.h && <span>{forwarwardDur.h}:</span>}
          <span>{forwarwardDur.m}:</span>
          <span>{forwarwardDur.s}</span>
        </div>
      </Stats>
      <Stats gap="20px" justify="center" align="center">
        <SubjShortStats subj={subj} list={list} mode="reverse" />
        <div>
          {!!reverseDur.h && <span>{reverseDur.h}:</span>}
          <span>{reverseDur.m}:</span>
          <span>{reverseDur.s}</span>
        </div>
      </Stats>
      <Stats gap="20px" justify="center" align="center">
        <SubjShortStats subj={subj} list={list} mode="spelling" />
        <div>
          {!!spellDur.h && <span>{spellDur.h}:</span>}
          <span>{spellDur.m}:</span>
          <span>{spellDur.s}</span>
        </div>
      </Stats>
      <ButtonsSection justify="center">
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
        <Button
          color="blue"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/subjs/${subj}/lists/${listId}/play/spelling`);
          }}
        >
          Spelling bee
        </Button>
      </ButtonsSection>
      <Typography.Title level={2}>
        Definitions ({Intl.NumberFormat().format(list.length)})
      </Typography.Title>

      <Flex wrap="wrap" gap="5px 15px">
        {pageItems.map((def) => (
          <TermLink key={def} term={def} subj={subj} />
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

const Stats = styled(Flex)`
  margin-bottom: 15px;
`;
const ButtonsSection = styled(Flex)`
  margin-bottom: 15px;
  gap: 10px;
  flex-wrap: wrap;
`;

const PagesControl = styled(Pagination)`
  padding: 20px 0;
`;
