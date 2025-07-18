import { styled } from '@linaria/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Tag } from 'primereact/tag';
import type { FC } from 'react';
import { Link } from 'react-router';
import { Colors } from '../../consts/colors';
import { db } from '../../db';
import { pickStatus } from './utils';

export const TermLink: FC<{
  term: string;
  subj: string;
  mode?: string;
  to?: string;
  className?: string;
}> = ({ subj, term, to, className, mode }) => {
  const statuses = useLiveQuery(
    () =>
      db.statuses
        .where({
          subj,
          term,
          mode: mode ?? 'forward',
        })
        .toArray(),
    [mode, subj, term],
  );

  const status = pickStatus(statuses);

  const icons = {
    excluded: '❌',
    unknown: '🙈',
    awared: '🤔',
    mastered: '🤓',
    new: '❓',
  };

  return (
    <STermLink
      to={to ?? `/subjs/${subj}/defs/${encodeURIComponent(term)}`}
      className={className}
      data-status={status}
    >
      <STermTag rounded data-status={status}>
        <span>{status ? icons[status] : '...'}</span>
        <span>{term}</span>
      </STermTag>
    </STermLink>
  );
};

export const STermLink = styled(Link)`
    display: inline-block;
    border-radius: 15px;

    &:hover {
      text-decoration: underline;
    }
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
