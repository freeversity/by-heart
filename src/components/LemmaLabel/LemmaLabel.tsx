import { CloseOutlined, InfoOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Flex, Modal } from 'antd';
import { type FC, Suspense, useState } from 'react';
import { Colors } from '../../consts/colors';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { FlippedCard } from '../FlippedCard/FlippedCard';

export const LemmaLabel: FC<{
  className?: string;
  lemma: string;
  subj: string;
  mode?: string;
  def?: string;
  type: string;
}> = ({ className, lemma, subj, mode, def, type }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Lemma className={className}>{lemma}</Lemma>{' '}
      <Button
        shape="circle"
        size="small"
        onClick={() => {
          setOpen(true);
        }}
      >
        <InfoOutlined />
      </Button>
      <Modal
        closable={false}
        okText={null}
        open={isOpen}
        onCancel={() => {
          setOpen(false);
        }}
        footer={
          <Flex justify="center">
            <CloseDrawerButton
              onClick={() => {
                setOpen(false);
              }}
              variant="solid"
              size="large"
              shape="circle"
              color="primary"
              icon={<CloseOutlined />}
            />
          </Flex>
        }
      >
        <ErrorBoundary>
          <Suspense>
            <FlippedCard
              type={type}
              term={lemma}
              subj={subj}
              mode={mode}
              def={def}
            />
          </Suspense>
        </ErrorBoundary>
      </Modal>
    </>
  );
};

const Lemma = styled.span`
    color: ${Colors.greys[2]};
`;

const CloseDrawerButton = styled(Button)`
    margin-top: 20px;
    bottom: 10px;
`;
