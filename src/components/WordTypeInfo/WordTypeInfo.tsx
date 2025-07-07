import { grey } from '@ant-design/colors';
import { styled } from '@linaria/react';
import { Button, Card, Collapse, ColorPicker, Divider, Flex } from 'antd';
import { type FC, useRef } from 'react';
import type { WordDefinition } from '../../api/defs';
import { Colors } from '../../consts/colors';
import { speak } from '../../utils/speak';

export const WordTypeInfo: FC<{
  type: WordDefinition['types'][0];
  className?: string;
}> = ({ type: { type, forms, trans, initial, html }, className }) => {
  const shortInfo = (
    <>
      <TypeHeading key={type}>
        {type}{' '}
        {forms && (
          <FromLabel>
            ({forms.map(({ g, n }) => `${g}, ${n}`).join('/')}){' '}
            {!!initial?.length && (
              <>
                of <strong>{initial}</strong>
              </>
            )}
          </FromLabel>
        )}
      </TypeHeading>
      {!!trans?.length && (
        <TransList>
          {trans.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </TransList>
      )}
    </>
  );

  if (!html) return shortInfo;
  return (
    <WikiCollapse
      ghost
      items={[
        {
          label: shortInfo,
          // biome-ignore lint/security/noDangerouslySetInnerHtml: this is html from wiktionary
          children: <div dangerouslySetInnerHTML={{ __html: html }} />,
        },
      ]}
    />
  );
};

const TypeHeading = styled.h2`
  text-align: left;
  margin: 0;
`;

const FromLabel = styled.span`
    color: ${Colors.greys[2]};
    font-size: 0.8em;
    font-weight: 400;
    font-style: italic;
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
