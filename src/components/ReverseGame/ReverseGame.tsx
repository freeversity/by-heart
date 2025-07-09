import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Card, Divider, Drawer, Flex, Typography } from 'antd';
import { useAtom } from 'jotai';
import { type FC, Suspense, useEffect, useState } from 'react';
import { getNextReverse } from '../../api/game';
import { db } from '../../db';
import { useRefCallback } from '../../hooks/useRefCallback';
import { useListId, useSubj } from '../../hooks/useSubj';
import { currentListAtom } from '../../state/currentList/atoms';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { FlippedCard } from '../FlippedCard/FlippedCard';
import { PageLayout } from '../PageLayout';
import { SubjShortStats } from '../SubjShortStats';
import { Timer } from '../Timer/Timer';

const mode = 'reverse';

export const ReverseGame: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [pair, setPair] = useState<{ term: string; def: string } | null>(null);

  const [isLoadingNext, setLoadingNext] = useState(false);

  const [isFlipped, setFlipped] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [list] = useAtom(currentListAtom({ subj, id: listId }));

  const onNext = useRefCallback(
    async (status?: 'unknown' | 'awared' | 'mastered') => {
      try {
        setPair(null);
        setLoadingNext(true);
        setFlipped(false);
        setShowFull(false);

        const nextTerm = await getNextReverse({
          list,
          subj,
          status,
          ...pair,
        });

        if (nextTerm) {
          setPair(nextTerm);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNext(false);
      }
    },
  );

  useEffect(() => {
    onNext();
  }, [onNext]);

  const onUnknown = async () => {
    onNext('unknown');
  };

  const onFamiliar = async () => {
    onNext('awared');
  };

  const onMastered = async () => {
    onNext('mastered');
  };

  return (
    <PageLayout
      header={listId}
      footer={
        <Flex gap="10px" justify="center" align="center">
          <Button size="large" onClick={onUnknown} loading={isLoadingNext}>
            🙈
          </Button>
          <Button size="large" onClick={onFamiliar} loading={isLoadingNext}>
            🤔
          </Button>
          <Button size="large" onClick={onMastered} loading={isLoadingNext}>
            🤓
          </Button>
        </Flex>
      }
    >
      <SubjShortStats subj={subj} list={list} mode="reverse" />
      <STimer
        onPause={(start, end) => {
          db.durations.add({
            subj,
            listId,
            mode,
            timestamp: start,
            duration: end - start,
          });
        }}
      />
      <Content justify="center" align="center">
        {!isFlipped && pair && (
          <DefCard>
            <Typography.Text strong italic>
              {pair.def}
            </Typography.Text>
            <Divider />
            <Button
              variant="solid"
              size="large"
              color="primary"
              disabled={!pair}
              onClick={() => {
                setFlipped((isFlipped) => !isFlipped);
              }}
            >
              Flip!
            </Button>
          </DefCard>
        )}
        {isFlipped && pair && (
          <Suspense fallback="Loading...">
            <FlippedCardWrapper>
              <FlippedCardContent
                detailed={false}
                def={pair.term}
                subj={subj}
              />
            </FlippedCardWrapper>
            <Flex gap="10px">
              <Button
                variant="solid"
                size="large"
                color="default"
                onClick={() => {
                  setFlipped((isFlipped) => !isFlipped);
                }}
              >
                Back
              </Button>
              <Button
                icon={<InfoCircleOutlined />}
                size="large"
                color="default"
                onClick={() => {
                  setShowFull(true);
                }}
              >
                Full info
              </Button>
            </Flex>
          </Suspense>
        )}
      </Content>
      {pair && (
        <Drawer
          size="large"
          placement="bottom"
          open={showFull}
          closable={false}
          onClose={() => {
            setShowFull(false);
          }}
        >
          <ErrorBoundary>
            <Suspense>
              <FullInfoCard def={pair.term} subj={subj} />
            </Suspense>
          </ErrorBoundary>
          <CloseDrawerButton
            onClick={() => {
              setShowFull(false);
            }}
            variant="solid"
            size="large"
            shape="circle"
            color="primary"
            icon={<CloseOutlined />}
          />
        </Drawer>
      )}
    </PageLayout>
  );
};

const Content = styled(Flex)`
    gap: 20px;
    flex-direction: column;
    display: flex;
    width: 100%;
    height: 100%;
    flex-grow: 1;
`;

const DefCard = styled(Card)`
    width: fit-content;
    min-width: 300px;
`;

const FlippedCardWrapper = styled(Card)`
    max-width: 600px;
    width: 100%;
`;
const FlippedCardContent = styled(FlippedCard)`
    width: 100%;
`;

const FullInfoCard = styled(FlippedCard)`
    width: 100%;
    margin-bottom: 50px;
`;

const CloseDrawerButton = styled(Button)`
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
`;

const STimer = styled(Timer)`
    margin: 5px 0;
`;
