import {
  EditOutlined,
  PlayCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { styled } from '@linaria/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Tag } from 'primereact/tag';
import { type FC, useMemo } from 'react';
import { Colors } from '../../consts/colors';
import { db } from '../../db';
import { Status } from '../../db/db';

export const SubjShortStats: FC<{
  className?: string;
  subj: string;
  mode?: string;
  list?: string[];
  timestamp?: number;
}> = ({
  subj,
  mode = 'forward',
  list,
  className,
  timestamp = Number.NEGATIVE_INFINITY,
}) => {
  const statuses = useLiveQuery(() => {
    const listSet = list && new Set(list);

    const req = db.statuses
      .where({ subj, mode })
      .and((status) => status.timestamp > timestamp);

    if (listSet) {
      req.and(({ term }) => listSet?.has(term));
    }

    return req.toArray();
  }, [timestamp, subj, mode, list]);

  const stats = useMemo(
    () =>
      statuses
        ? statuses.reduce<{ [key in Status]: number }>(
            (stats, { status }) => {
              stats[status] += 1;

              return stats;
            },
            {
              [Status.Mastered]: 0,
              [Status.Awared]: 0,
              [Status.Unknown]: 0,
              [Status.Excluded]: 0,
            },
          )
        : {
            [Status.Mastered]: undefined,
            [Status.Awared]: undefined,
            [Status.Unknown]: undefined,
            [Status.Excluded]: undefined,
          },
    [statuses],
  );

  let modeIcon = <PlayCircleFilled />;

  if (mode === 'reverse') {
    modeIcon = <ReloadOutlined />;
  } else if (mode === 'spelling') {
    modeIcon = <EditOutlined />;
  }

  return (
    <Panel className={className}>
      <ModeTag color={Colors.neutral[8]}>{modeIcon}</ModeTag>
      <STermTag data-status={'mastered'}>
        <span>🤓</span>
        <span>{stats[Status.Mastered] ?? '...'}</span>
      </STermTag>
      <STermTag data-status={'awared'}>
        <span>🤔</span>
        <span>{stats[Status.Awared] ?? '...'}</span>
      </STermTag>
      <STermTag data-status={'unknown'}>
        <span>🙈</span>
        <span>{stats[Status.Unknown] ?? '...'}</span>
      </STermTag>
    </Panel>
  );
};

const Panel = styled.div`
  justify-content: center;
  display: flex;
  gap: 5px;
`;

const ModeTag = styled(Tag)`
    background-color: ${Colors.neutral[8]};
`;

export const STermTag = styled(Tag)`
    position: relative;
    padding: 2px 10px;
    text-decoration: inherit;
    background-color: ${Colors.neutral[1]};

    & > span {
      display: inline-flex;
      gap: 6px;
      align-items: center;
    }
    
    &[data-status='new'] {
        font-weight: bold;
        color: ${Colors.neutral[9]};
        outline: 1px dashed ${Colors.neutral[6]};
    }

    &[data-status='excluded'] {
        text-decoration: overline;
        font-weight: normal;
        background-color: ${Colors.excluded};
    }

    &[data-status='mastered'] {
        background-color: ${Colors.mastered};
    }

    &[data-status='awared'] {
        background-color: ${Colors.awared};
    }

    &[data-status='unknown'] {
        background-color: ${Colors.unknown};
    }
`;
