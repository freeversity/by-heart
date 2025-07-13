import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import {
  Button,
  Card,
  Divider,
  Drawer,
  Flex,
  Input,
  type InputRef,
  Typography,
} from 'antd';
import { useAtom } from 'jotai';
import { type FC, Suspense, useEffect, useRef, useState } from 'react';
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
import { TermStatus } from '../TermStatus';
import { TermStatusHistory } from '../TermStatusHistory';
import { Timer } from '../Timer/Timer';

const mode = 'spelling';

export const SpellingGame: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [pair, setPair] = useState<{ term: string; def: string } | null>(null);
  const [ipaHidden, setIpaHidden] = useState(true);

  const [isLoadingNext, setLoadingNext] = useState(false);

  const [guess, setGuess] = useState('');

  const [isFlipped, setFlipped] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [list] = useAtom(currentListAtom({ subj, id: listId }));

  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<InputRef>(null);

  const status =
    guess.toLocaleLowerCase().trim() === pair?.term.toLocaleLowerCase()
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

          requestAnimationFrame(() => {
            inputRef.current?.focus();

            setTimeout(() => {
              inputRef.current?.input?.scrollIntoView({
                behavior: 'instant',
                block: 'end',
              });
            }, 500);
          });
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
    <PageLayout
      header={listId}
      footer={
        <Flex gap="20px" justify="center">
          {isFlipped && (
            <>
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
              <Button
                ref={nextBtnRef}
                variant="solid"
                size="large"
                color="default"
                onClick={() => {
                  onNext(status);
                }}
              >
                Next
              </Button>
            </>
          )}
          {!isFlipped && (
            <>
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

                  requestAnimationFrame(() => {
                    nextBtnRef.current?.focus();
                  });
                }}
                loading={isLoadingNext}
              >
                Submit
              </Button>
            </>
          )}
        </Flex>
      }
    >
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
        {pair && (
          <TermStatusHistory
            mode={mode}
            term={pair.term}
            def={pair.def}
            subj={subj}
          />
        )}
        {!isFlipped && pair && (
          <DefCard>
            <Typography.Title level={3}>
              <Status mode={mode} term={pair.term} def={pair.def} subj={subj} />{' '}
              {pair.def}
            </Typography.Title>
            <Divider />
            <Suspense>
              <FlashCardContent
                hidden
                mode={mode}
                term={pair.term}
                def={pair.def}
                subj={subj}
                ipaHidden={ipaHidden}
                setIpaHidden={setIpaHidden}
              />
            </Suspense>
            <Divider />
            <Form
              onSubmit={(e) => {
                e.preventDefault();

                setFlipped(true);

                requestAnimationFrame(() => {
                  nextBtnRef.current?.focus();
                });
              }}
            >
              <SpellingInput
                ref={inputRef}
                placeholder="Spell the word"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                }}
              />
              <SubmitInput type="submit" />
            </Form>
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
    margin-bottom: 20%;
`;

const Status = styled(TermStatus)`
  vertical-align: middle;
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

const Form = styled.form`
  height: auto;
`;

const SpellingInput = styled(Input)`
  margin: 0;
`;

const SubmitInput = styled(Input)`
  visibility: hidden;
  height: 1px;
  padding: 0;
`;
