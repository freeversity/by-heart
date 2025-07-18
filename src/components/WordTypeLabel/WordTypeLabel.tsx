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
    <FormLabel>
      {('noun' === type.type ||
        'pronoun' === type.type ||
        'adj' === type.type) &&
        type.forms.map(({ g, n }) => `${g}/${n}`).join(', ')}
      {'verb' === type.type &&
        type.forms
          .map(({ m, t, p, n }) =>
            [p, n, t, m].filter((item) => !!item).join('/'),
          )
          .join(', ')}{' '}
    </FormLabel>
  );
};

const FormLabel = styled.span`
  text-align: left;
  color: ${Colors.gray[2]};
  font-size: 0.9em;
  font-weight: 400;
  font-style: italic;
`;
