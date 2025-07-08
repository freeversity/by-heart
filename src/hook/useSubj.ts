import { useParams } from 'react-router';

export function useSubj() {
  const { subj } = useParams();

  if (!subj) throw new Error('Subject is not defined!');

  return subj;
}

export function useListId() {
  const { listId } = useParams();

  if (!listId) throw new Error('Subject is not defined!');

  return listId;
}
