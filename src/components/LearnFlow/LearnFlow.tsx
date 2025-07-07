import { useAtom } from 'jotai';
import type { FC } from 'react';
import { useParams } from 'react-router';
import { currentListAtom } from '../../state/currentList/atoms';

export const LearnFlow: FC<{ className?: string }> = () => {
  const { id, subj } = useParams();

  if (!id || !subj) throw new Error('No subject or list id present');

  const [list] = useAtom(currentListAtom({ id, subj }));

  return null;
};
