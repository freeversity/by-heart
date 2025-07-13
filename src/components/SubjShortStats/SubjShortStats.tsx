import {
  EditOutlined,
  PlayCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { type FC, useMemo } from 'react';
import { Colors } from '../../consts/colors';
import { db } from '../../db';
import { Status } from '../../db/db';

export const SubjShortStats: FC<{
  className?: string;
  subj: string;
  mode?: string;
  list?: string[];
}> = ({ subj, mode = 'forward', list, className }) => {
  const listSet = useMemo(() => list && new Set(list), [list]);
  const statuses = useLiveQuery(() => {
    const req = db.statuses.where({ subj, mode });

    if (listSet) {
      req.and(({ term }) => listSet?.has(term));
    }

    return req.toArray();
  });

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
    <div className={className}>
      <Tag color={Colors.neutral[7]}>{modeIcon}</Tag>
      <Tag color={Colors.mastered} icon={'🤓'}>
        {' '}
        {stats[Status.Mastered] ?? '...'}
      </Tag>
      <Tag color={Colors.awared} icon={'🤔'}>
        {' '}
        {stats[Status.Awared] ?? '...'}
      </Tag>
      <Tag color={Colors.unknown} icon={'🙈'}>
        {' '}
        {stats[Status.Unknown] ?? '...'}
      </Tag>
    </div>
  );
};
