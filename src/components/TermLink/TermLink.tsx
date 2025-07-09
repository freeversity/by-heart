import { styled } from '@linaria/react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { FC } from 'react';
import { Link } from 'react-router';
import { Colors } from '../../consts/colors';
import { db } from '../../db';

export const TermLink: FC<{
  term: string;
  subj: string;
  mode?: string;
  to?: string;
  className?: string;
}> = ({ subj, term, to, className }) => {
  const status = useLiveQuery(() =>
    db.statuses.get({
      subj,
      term,
      mode: 'forward',
      def: '',
    }),
  );

  return (
    <STermLink
      to={to ?? `/subjs/${subj}/defs/${encodeURIComponent(term)}`}
      className={className}
      data-status={status?.status}
    >
      {term}
    </STermLink>
  );
};

export const STermLink = styled(Link)`
    display: inline-block;
    position: relative;
    text-decoration: underline;
    
    &[data-status] {
        font-weight: bold;
    }

    &[data-status='excluded'] {
        text-decoration: overline;
        font-weight: normal;
        color: ${Colors.excluded};
    }

    &[data-status='mastered'] {
        color: ${Colors.mastered};
    }

    &[data-status='awared'] {
        color: ${Colors.awared};
    }

    &[data-status='unknown'] {
        color: ${Colors.unknown};
    }
`;
