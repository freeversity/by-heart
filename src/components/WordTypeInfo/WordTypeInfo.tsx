import { styled } from '@linaria/react';
import { Card, Collapse, Flex, List, Table, Typography } from 'antd';
import type { FC } from 'react';
import type { WordDefinition } from '../../api/defs';
import { Conjugation } from '../Conjugation/Conjugation';
import { WikiHtml } from '../WikiHtml';
import { WordTypeLabel } from '../WordTypeLabel';

export const WordTypeInfo: FC<{
  type: WordDefinition['types'][0];
  className?: string;
  detailed?: boolean;
}> = ({ type, className, detailed = true }) => {
  const items = [
    {
      label: 'Wiktionary',
      children: <WikiHtml html={type.html} />,
    },
    ...(type.preps?.length
      ? [
          {
            label: 'Prepositions',
            children: (
              <Table
                pagination={false}
                dataSource={type.preps}
                columns={[
                  { title: 'Type', dataIndex: 'rel', key: 'rel' },
                  { title: 'Preposition', dataIndex: 'prep', key: 'prep' },
                  { title: 'Examples', dataIndex: 'ex', key: 'ex' },
                ]}
              />
            ),
          },
        ]
      : []),
    ...(type.conj?.length
      ? [
          {
            label: 'Conjugation',
            children: <Conjugation conj={type.conj} />,
          },
        ]
      : []),
  ];
  return (
    <div>
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
      {detailed && (
        <WikiCollapse
          accordion
          collapsible={type.html ? 'header' : 'disabled'}
          className={className}
          // ghost
          items={items}
        />
      )}
    </div>
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
.ant-collapse-header-text {
  text-align: left;
}
`;

const ConjCard = styled(Card)`
  flex-basis: 25%;
  flex-grow: 1;
  min-width: 200px;

  .ant-card-body {
    padding: 5px 12px;
  }
`;

const ConjListItem = styled(List.Item)`
    padding: 5px 0 !important;
`;
