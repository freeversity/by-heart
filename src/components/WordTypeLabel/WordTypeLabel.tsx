import { styled } from '@linaria/react';
import type { FC } from 'react';
import type { WordDefinition } from '../../api/defs';
import { Colors } from '../../consts/colors';

export const WordTypeLabel: FC<{
  classname?: string;
  type: WordDefinition['types'][number];
}> = ({ type }) => {
  if (!type.forms && !type.initial) return null;

  return (
    <FromLabel>
      {('noun' === type.type ||
        'pronoun' === type.type ||
        'adj' === type.type) &&
        type.forms.map(({ g, n }) => `${g}, ${n}`).join('/')}
      {'verb' === type.type &&
        type.forms
          .map(({ mod, tense }) => `${mod}${tense ? `, ${tense}` : ''}`)
          .join('/')}{' '}
      {!!type.initial?.length && (
        <>
          of <strong>{type.initial}</strong>
        </>
      )}
    </FromLabel>
  );
};

const FromLabel = styled.span`
    color: ${Colors.greys[2]};
    font-size: 0.8em;
    font-weight: 400;
    font-style: italic;
`;
