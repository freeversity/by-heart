import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Card, Divider, Drawer, Flex, Input, Typography } from 'antd';
import { useAtom } from 'jotai';
import { type FC, Suspense, useEffect, useState } from 'react';
import { getNextReverse } from '../../api/game';
import { Colors } from '../../consts/colors';
import { db } from '../../db';
import { useRefCallback } from '../../hooks/useRefCallback';
import { useListId, useSubj } from '../../hooks/useSubj';
import { currentListAtom } from '../../state/currentList/atoms';
import { normalizeString } from '../../utils/normilize';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { FlashCard } from '../FlashCard';
import { FlippedCard } from '../FlippedCard/FlippedCard';
import { PageLayout } from '../PageLayout';
import { SubjShortStats } from '../SubjShortStats';
import { Timer } from '../Timer/Timer';

const mode = 'spelling';

export const SpellingGame: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [pair, setPair] = useState<{ term: string; def: string } | null>(null);

  const [isLoadingNext, setLoadingNext] = useState(false);

  const [guess, setGuess] = useState('');

  const [isFlipped, setFlipped] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [list] = useAtom(currentListAtom({ subj, id: listId }));

  const status =
    guess.toLocaleLowerCase() === pair?.term.toLocaleLowerCase()
      ? 'mastered'
      : normalizeString(guess) === normalizeString(pair?.term ?? '')
        ? 'awared'
        : 'unknown';

  const onNext = useRefCallback(
    async (status?: 'unknown' | 'awared' | 'mastered') => {
      try {
        setPair(null);
        setLoadingNext(true);
        setFlipped(false);
        setShowFull(false);
        setGuess('');

        const nextTerm = await getNextReverse({
          list,
          subj,
          status,
          mode,
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

  return (
    <PageLayout header={listId}>
      <SubjShortStats subj={subj} list={list} mode="spelling" />
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
            <Typography.Title level={3}>{pair.def}</Typography.Title>
            <Divider />
            <Suspense>
              <FlashCardContent hidden def={pair.term} subj={subj} />
            </Suspense>
            <Divider />
            <SpellingInput
              rows={2}
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
              }}
            />
            <Flex gap="20px" justify="center">
              <Button
                icon="🙈"
                onClick={() => {
                  setFlipped(true);
                }}
                loading={isLoadingNext}
              >
                Flip!
              </Button>
              <Button
                icon="🤓"
                color="primary"
                variant="solid"
                onClick={() => {
                  setFlipped(true);
                }}
                loading={isLoadingNext}
              >
                Submit
              </Button>
            </Flex>
          </DefCard>
        )}
        {isFlipped && pair && (
          <Suspense fallback="Loading...">
            <Typography.Title style={{ color: Colors[status] }} level={3}>
              {guess}
            </Typography.Title>
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
                  onNext(status);
                }}
              >
                Next
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

const FlashCardContent = styled(FlashCard)`
    width: 300px;
    margin: 0 auto;
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

const SpellingInput = styled(Input.TextArea)`
    resize: none !important;
    margin-bottom: 20px;
`;
