import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Card, Divider, Drawer, Flex } from 'antd';
import { useAtom } from 'jotai';
import { type FC, Suspense, useEffect, useState } from 'react';
import { getNextForward } from '../../api/game';
import { db } from '../../db';
import { useRefCallback } from '../../hooks/useRefCallback';
import { useListId, useSubj } from '../../hooks/useSubj';
import { currentListAtom } from '../../state/currentList/atoms';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { FlashCard } from '../FlashCard';
import { FlippedCard } from '../FlippedCard/FlippedCard';
import { PageLayout } from '../PageLayout';
import { SubjShortStats } from '../SubjShortStats';
import { TermStatusHistory } from '../TermStatusHistory';
import { Timer } from '../Timer/Timer';

const mode = 'forward';

export const ForwardGame: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [def, setDef] = useState<string | null>(null);

  const [isLoadingNext, setLoadingNext] = useState(false);

  const [isFlipped, setFlipped] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [list] = useAtom(currentListAtom({ subj, id: listId }));

  const onNext = useRefCallback(
    async (status?: 'unknown' | 'awared' | 'mastered') => {
      try {
        setDef(null);
        setLoadingNext(true);
        setFlipped(false);
        setShowFull(false);

        const nextTerm = await getNextForward({
          list,
          subj,
          term: def,
          status,
        });

        if (nextTerm) {
          setDef(nextTerm);
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
      <SubjShortStats subj={subj} list={list} />
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
        {!!def && <TermStatusHistory term={def} mode={mode} subj={subj} />}
        {!isFlipped && def && (
          <DefCard>
            <Suspense fallback="Loading...">
              <FlashCardContent term={def} mode={mode} subj={subj} />
            </Suspense>
            <Divider />
            <Button
              variant="solid"
              size="large"
              color="primary"
              disabled={!def}
              onClick={() => {
                setFlipped((isFlipped) => !isFlipped);
              }}
            >
              Flip!
            </Button>
          </DefCard>
        )}
        {isFlipped && def && (
          <Suspense fallback="Loading...">
            <FlippedCardWrapper>
              <FlippedCardContent detailed={false} def={def} subj={subj} />
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
      {def && (
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
              <FullInfoCard def={def} subj={subj} />
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
    gap: 10px;
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

const FlashCardContent = styled(FlashCard)`
    width: 300px;
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
