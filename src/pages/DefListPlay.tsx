import { InfoCircleOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Card, Divider, Drawer, Flex } from 'antd';
import { useAtom } from 'jotai';
import { type FC, Suspense, useEffect, useRef, useState } from 'react';
import { FlashCard } from '../components/FlashCard';
import { FlippedCard } from '../components/FlippedCard/FlippedCard';
import { PageLayout } from '../components/PageLayout';
import { db } from '../db';
import { useRefCallback } from '../hook/useRefCallback';
import { useListId, useMode, useSubj } from '../hook/useSubj';
import { currentListAtom } from '../state/currentList/atoms';

export const DefListPlay: FC = () => {
  const subj = useSubj();
  const mode = useMode();
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

        if (def && status) {
          await db.progress.add({
            subj,
            def,
            status: status,
            timestamp: Date.now(),
            mode: mode,
          });
        }

        const [allIntroduced, staledMastered, staledAwared, staledUnknown] =
          await Promise.all([
            db.progress
              .where('subj')
              .equals(subj)
              .and((item) => item.mode === mode)
              .toArray(),

            db.progress
              .where('timestamp')
              .below(Date.now() - 1000 * 60 * 60 * 24 * 7)
              .and(
                (item) =>
                  item.mode === mode &&
                  item.subj === subj &&
                  item.status === 'mastered',
              )
              .toArray(),
            db.progress
              .where('timestamp')
              .below(Date.now() - 1000 * 60 * 60 * 5)
              .and(
                (item) =>
                  item.mode === mode &&
                  item.subj === subj &&
                  item.status === 'awared',
              )
              .toArray(),
            db.progress
              .where('timestamp')
              .below(Date.now() - 1000 * 20)
              .and(
                (item) =>
                  item.mode === mode &&
                  item.subj === subj &&
                  item.status === 'unknown',
              )
              .toArray(),
          ]);

        const random = Math.floor(Math.random() * 100);

        let nextDef: string | undefined;

        if (random < 5 && staledMastered.length) {
          const randomIndex = Math.floor(Math.random() * staledMastered.length);

          nextDef = staledMastered[randomIndex]?.def;
        } else if (random < 15 && staledAwared.length) {
          const randomIndex = Math.floor(Math.random() * staledAwared.length);

          nextDef = staledAwared[randomIndex]?.def;
        } else if (random < 50 && staledUnknown.length) {
          const randomIndex = Math.floor(Math.random() * staledUnknown.length);

          nextDef = staledUnknown[randomIndex]?.def;
        } else {
          const introducedSet = new Set(allIntroduced.map(({ def }) => def));

          nextDef = list.find((def) => !introducedSet.has(def));
        }

        if (nextDef) {
          setDef(nextDef);
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
      <Content justify="center" align="center">
        {!isFlipped && def && (
          <DefCard>
            <Suspense fallback="Loading...">
              {!isFlipped && <FlashCardContent def={def} subj={subj} />}
            </Suspense>
            <Divider />
            <Button
              variant="solid"
              size="large"
              color="primary"
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
            <FlippedCardContent detailed={false} def={def} subj={subj} />
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
          onClose={() => {
            setShowFull(false);
          }}
        >
          <Suspense>
            <FullInfoCard def={def} subj={subj} />
          </Suspense>
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
    max-width: fit-content;
`;

const FlashCardContent = styled(FlashCard)`
    width: 300px;
`;

const FlippedCardContent = styled(FlippedCard)`
    max-width: 600px;
    width: 100%;
`;

const FullInfoCard = styled(FlippedCard)`
    width: 100%;

`;
