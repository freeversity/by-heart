import { styled } from '@linaria/react';
import { Flex } from 'antd';
import { useAtom } from 'jotai';
import type { FC } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useSubj } from '../../hook/useSubj';
import { defsPageContent } from '../../state/definitions/atoms';

export const DefsPages: FC = () => {
  const subj = useSubj();
  const [params] = useSearchParams();

  const page = +(params.get('page') ?? 1);

  const [items] = useAtom(defsPageContent({ subj, page }));

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
