import { styled } from '@linaria/react';
import { Collapse, Flex, Table } from 'antd';
import type { FC } from 'react';
import type { WordDefinition } from '../../api/defs';
import { Colors } from '../../consts/colors';
import { Conjugation } from '../Conjugation/Conjugation';
import { LemmaLabel } from '../LemmaLabel/LemmaLabel';
import { TermStatus } from '../TermStatus';
import { WikiHtml } from '../WikiHtml';
import { WordTypeLabel } from '../WordTypeLabel';

export const WordTypeInfo: FC<{
  type: WordDefinition['types'][0];
  subj: string;
  term: string;
  className?: string;
  detailed?: boolean;
  mode?: string;
  def?: string;
  hideStatus?: boolean;
}> = ({
  type,
  className,
  subj,
  mode,
  def,
  term,
  detailed = true,
  hideStatus,
}) => {
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
      <Flex justify="flex-start" align="baseline" gap="10px">
        {!hideStatus && (
          <TermStatus
            subj={subj}
            mode={mode ?? 'forward'}
            type={type.type}
            def={def}
            term={term}
          />
        )}
        <TypeHeading key={type.type}>
          {type.type}{' '}
          {type.initial && (
            <>
              <FormOfLabel>form of</FormOfLabel>{' '}
              <LemmaLabel
                lemma={type.initial}
                subj={subj}
                mode={mode}
                type={type.type}
                def={def}
              />
            </>
          )}{' '}
        </TypeHeading>
      </Flex>
      <div style={{ textAlign: 'left' }}>
        <WordTypeLabel type={type} />
      </div>

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
          items={items}
        />
      )}
    </div>
  );
};

const TypeHeading = styled.h3`
  text-align: left;
  margin: 0;
`;

const FormOfLabel = styled.span`
  color: ${Colors.gray[0]};
  font-weight: normal;
  font-style: italic;
`;

const TransList = styled.ul`
  text-align: left;
  margin: 10px 0;
  padding-left: 20px;
`;

const WikiCollapse = styled(Collapse)`
  margin: 10px 0;

  .ant-collapse-header-text {
    text-align: left;
  }
`;
