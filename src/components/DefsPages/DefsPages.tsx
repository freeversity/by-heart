import { styled } from '@linaria/react';
import { Flex } from 'antd';
import { useAtom } from 'jotai';
import type { FC } from 'react';
import { Link } from 'react-router';
import { useSubj } from '../../hook/useSubj';
import { defsPageContent } from '../../state/definitions/atoms';

export const DefsPages: FC = () => {
  const subj = useSubj();
  const [items] = useAtom(defsPageContent(subj));

  return (
    <Flex wrap="wrap" gap="5px 15px">
      {items.map((def) => (
        <WordLink
          key={def}
          to={`/subjs/${subj}/defs/${encodeURIComponent(def)}`}
        >
          {def}
        </WordLink>
      ))}
    </Flex>
  );
};

const WordLink = styled(Link)`
    text-decoration: underline;
`;
