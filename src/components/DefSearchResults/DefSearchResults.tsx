import { styled } from '@linaria/react';
import { List } from 'antd';
import { useAtom } from 'jotai';
import type { FC } from 'react';
import { Link } from 'react-router';
import { currentSearch, currentSearchQuery } from '../../state/search/atoms';
import { splitBySearchTerm } from './utils';

export const DefSearchResults: FC<{
  className?: string;
  subj: string;
  onClose?: () => void;
}> = ({ className, subj, onClose }) => {
  const [query] = useAtom(currentSearchQuery);
  const [results] = useAtom(currentSearch(subj));

  if (!query) return null;

  if (!results.length) return 'Nothing found';

  return (
    <List className={className}>
      {results.map((word) => (
        <ListItem key={word}>
          <LinkItem
            to={`/subjs/${subj}/defs/${encodeURIComponent(word)}`}
            onClick={onClose}
          >
            {splitBySearchTerm(word, query).map(({ frag, match }, index) =>
              match ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: no sorting here
                <mark key={index}>{frag}</mark>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: no sorting here
                <span key={index}>{frag}</span>
              ),
            )}
          </LinkItem>
        </ListItem>
      ))}
    </List>
  );
};

const ListItem = styled(List.Item)`
  padding: 0 !important;
`;
const LinkItem = styled(Link)`
display: block;
padding: 10px 0;
  width: 100%;
  height: 100%;
`;
