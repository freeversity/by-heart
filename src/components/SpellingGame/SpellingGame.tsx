import {
  CloseOutlined,
  DownOutlined,
  InfoCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
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
import { TransList } from '../TransList';

const mode = 'spelling';

export const SpellingGame: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [pair, setPair] = useState<{
    def: string;
    term: string;
    lemma: string | null;
    type: string;
  } | null>(null);
  const [ipaHidden, setIpaHidden] = useState(true);
  const [translationType, setTranslationType] = useState<string | null>(null);

  const [isLoadingNext, setLoadingNext] = useState(false);

  const [guess, setGuess] = useState('');

  const [isFlipped, setFlipped] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [list] = useAtom(currentListAtom({ subj, id: listId }));

  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<InputRef>(null);

  const status =
    guess.toLocaleLowerCase().trim() === pair?.term.toLocaleLowerCase() &&
    ipaHidden
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
        setIpaHidden(true);
        setTranslationType(null);

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
                loading={isLoadingNext}
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
                loading={isLoadingNext}
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
        {!isFlipped && pair && (
          <DefCard>
            <Flex justify="space-between" align="center" gap="10px">
              <TermStatus
                mode={mode}
                term={pair.term}
                type={pair.type}
                def={pair.def}
                subj={subj}
              />
              <Typography.Text strong italic>
                {pair.def} {pair.type && <TypeLabel>({pair.type})</TypeLabel>}
              </Typography.Text>
              <Button
                shape="circle"
                onClick={() => {
                  setTranslationType((type) => (type ? null : pair.type));
                }}
              >
                {translationType ? <DownOutlined /> : <UpOutlined />}
              </Button>
            </Flex>

            {pair && (
              <History
                mode={mode}
                term={pair.term}
                type={pair.type}
                def={pair.def}
                subj={subj}
              />
            )}
            <Divider />

            <Suspense>
              <FlashCardContent
                hidden
                mode={mode}
                term={pair.term}
                type={pair.type}
                def={pair.def}
                subj={subj}
                ipaHidden={ipaHidden}
                setIpaHidden={setIpaHidden}
              />
            </Suspense>
            <Divider />
            {translationType && (
              <Suspense>
                <TransList term={pair.term} subj={subj} type={pair.type} />
                <Divider />
              </Suspense>
            )}
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
          <FlippedCardWrapper>
            <Typography.Text
              style={{ color: Colors[status], fontSize: '1.5em' }}
              strong
            >
              {guess || '?'}
            </Typography.Text>
            {pair && (
              <History
                subj={subj}
                mode={mode}
                term={pair.term}
                type={pair.type}
                def={pair.def}
              />
            )}
            <Divider />
            <Suspense fallback="Loading...">
              <FlippedCardContent
                detailed={false}
                term={pair.term}
                type={pair.type}
                def={pair.def}
                mode={mode}
                subj={subj}
              />
            </Suspense>
          </FlippedCardWrapper>
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
              <FullInfoCard
                subj={subj}
                term={pair.term}
                def={pair.def}
                mode={mode}
              />
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
    padding-bottom: 40px;
`;

const DefCard = styled(Card)`
    width: fit-content;
    min-width: 300px;
`;

const FlashCardContent = styled(FlashCard)`
    width: 300px;
    margin: 0 auto;
    margin-bottom: 20px;
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

const TypeLabel = styled(Typography.Text)`
  white-space: nowrap;
  color: ${Colors.neutral[5]};
  font-weight: bold;
  min-width: 30px;
`;

const History = styled(TermStatusHistory)`
    width: 100%;
`;
