import { Flex } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import type { FC } from 'react';
import { Colors } from '../../consts/colors';
import { db } from '../../db';
import { Status } from '../../db/db';

export const TermStatusHistory: FC<{
  subj: string;
  mode: string;
  term: string;
  type: string;
  def?: string;
  className?: string;
}> = ({ subj, mode, term, def = '', className, type }) => {
  const events = useLiveQuery(() =>
    db.progress
      .where({
        subj,
        mode,
        term,
        def,
        type,
      })
      .toArray(),
  );

  const statuses = events?.map(({ status }) =>
    status === Status.Excluded ? Colors.red[6] : Colors[status],
  );

  if (!statuses?.length) return null;

  return (
    <Flex className={className} justify="center">
      {statuses.map((color, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no sorting
        <span style={{ color, fontSize: '2em', lineHeight: 1 }} key={index}>
          •
        </span>
      ))}
    </Flex>
  );
};
