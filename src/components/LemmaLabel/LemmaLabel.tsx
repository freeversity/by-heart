import {
  CloseOutlined,
  InfoCircleFilled,
  InfoOutlined,
} from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Flex, Modal } from 'antd';
import { type FC, Suspense, useState } from 'react';
import { Colors } from '../../consts/colors';
import { FlippedCard } from '../FlippedCard/FlippedCard';

export const LemmaLabel: FC<{
  className?: string;
  lemma: string;
  subj: string;
}> = ({ className, lemma, subj }) => {
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
        <Suspense>
          <FlippedCard def={lemma} subj={subj} />
        </Suspense>
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
