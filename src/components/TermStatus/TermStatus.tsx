import { styled } from '@linaria/react';
import { Tag } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import type { FC } from 'react';
import { Colors } from '../../consts/colors';
import { db } from '../../db';
import { Status } from '../../db/db';

export const TermStatus: FC<{
  subj: string;
  mode: string;
  term: string;
  type: string;
  def?: string;
  className?: string;
}> = ({ subj, mode, term, type, def = '', className }) => {
  const status = useLiveQuery(() =>
    db.statuses.get({
      subj,
      mode,
      term,
      def,
      type,
    }),
  );

  let statusIcon = '❓';

  if (status?.status === Status.Unknown) {
    statusIcon = '🙈';
  } else if (status?.status === Status.Awared) {
    statusIcon = '🤔';
  } else if (status?.status === Status.Mastered) {
    statusIcon = '🤓';
  } else if (status?.status === Status.Excluded) {
    statusIcon = '❌';
  }

  return (
    <STag
      className={className}
      color={status ? Colors[status.status] : Colors.neutral[3]}
    >
      {statusIcon}
    </STag>
  );
};

const STag = styled(Tag)`
    list-style: none;
    margin: 0
`;
