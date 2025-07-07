import { styled } from '@linaria/react';
import { Collapse, Divider } from 'antd';
import type { FC } from 'react';
import type { WordDefinition } from '../../api/defs';
import { WikiHtml } from '../WikiHtml';
import { WordTypeLabel } from '../WordTypeLabel';

export const WordTypeInfo: FC<{
  type: WordDefinition['types'][0];
  className?: string;
}> = ({ type, className }) => {
  return (
    <WikiCollapse
      collapsible={type.html ? 'header' : 'disabled'}
      className={className}
      ghost
      items={[
        {
          label: (
            <>
              <TypeHeading key={type.type}>
                {type.type} <WordTypeLabel type={type} />
              </TypeHeading>
              {!!type.trans?.length && (
                <TransList>
                  {type.trans.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </TransList>
              )}
            </>
          ),
          children: (
            <>
              <Divider />
              <WikiHtml html={type.html} />
            </>
          ),
        },
      ]}
    />
  );
};

const TypeHeading = styled.h2`
  text-align: left;
  margin: 0;
`;

const TransList = styled.ul`
  text-align: left;
  margin: 5px 0;
  padding-left: 20px;
`;

const WikiCollapse = styled(Collapse)`
    .ant-collapse-expand-icon {
        margin-top: 8px;
    }
`;
