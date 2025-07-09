import { useParams } from 'react-router';

export function useSubj() {
  const { subj } = useParams();

  if (!subj) throw new Error('Subject is not defined!');

  return subj;
}

export function useListId() {
  const { listId } = useParams();

  if (!listId) throw new Error('List Id is not defined!');

  return listId;
}

export function useMode() {
  const { mode } = useParams();

  if (!mode) throw new Error('Play mode is not defined!');

  return mode;
}
