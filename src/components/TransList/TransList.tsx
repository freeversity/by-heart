import { styled } from '@linaria/react';
import { List } from 'antd';
import { useAtom } from 'jotai';
import { type FC, useMemo } from 'react';
import { definitionAtom } from '../../state/currentDef/atoms';

export const TransList: FC<{
  term: string;
  subj: string;
  className?: string;
  type: string;
}> = ({ term, subj, className, type }) => {
  const [defPayload] = useAtom(definitionAtom({ subj, def: term }));

  const translations = useMemo(
    () =>
      defPayload.types.find((typePayload) => typePayload.type === type)?.trans,
    [defPayload, type],
  );

  if (!translations) return null;

  return (
    <DefList className={className}>
      {translations.map((tran) => (
        <li key={tran}>{tran}</li>
      ))}
    </DefList>
  );
};

const DefList = styled(List)`
    text-align:left;
    list-style: disc;
`;
