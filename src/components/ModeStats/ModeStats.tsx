import { styled } from '@linaria/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Divider } from 'primereact/divider';
import { type FC, useMemo } from 'react';
import { db } from '../../db';
import { Status } from '../../db/db';
import { formatDuration } from '../../utils/formatDuration';
import { DurationChart } from '../DurationChart';
import { StatusChart } from '../StatusChart';
import { SubjShortStats } from '../SubjShortStats';

import { values } from 'lodash';
import { MeterGroup } from 'primereact/metergroup';
import { LangProgressBar } from '../LangProgressBar';

export const ModeStats: FC<{
  mode: string;
  subj: string;
  list: string[];
  listId: string;
}> = ({ mode, subj, list, listId }) => {
  const today = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    return new Date(year, month, day);
  }, []);

  const timeRanges = useLiveQuery(
    () => db.durations.where({ mode }).toArray(),
    [mode],
  );

  const totalDuration = useMemo(
    () =>
      formatDuration(
        timeRanges?.reduce((duration, item) => duration + item.duration, 0) ??
          0,
      ),
    [timeRanges],
  );

  const todayDuration = useMemo(
    () =>
      formatDuration(
        timeRanges
          ?.filter(({ timestamp }) => timestamp > +today)
          .reduce((duration, item) => duration + item.duration, 0) ?? 0,
      ),
    [timeRanges, today],
  );

  const lemmas = useLiveQuery(
    () =>
      db.statuses
        .where({ subj, mode })
        .and(({ lemma }) => !lemma)
        .toArray(),
    [subj, mode],
  );

  const lemmasStats = useMemo(() => {
    const aggrData = lemmas?.reduce(
      (stats, { term, status }) => {
        if (status === Status.Excluded) return stats;

        stats[status].add(term);

        return stats;
      },
      {
        [Status.Mastered]: new Set<string>(),
        [Status.Awared]: new Set<string>(),
        [Status.Unknown]: new Set<string>(),
      },
    ) ?? {
      [Status.Mastered]: new Set<string>(),
      [Status.Awared]: new Set<string>(),
      [Status.Unknown]: new Set<string>(),
    };

    return {
      [Status.Mastered]: aggrData[Status.Mastered].size,
      [Status.Awared]: [...aggrData[Status.Awared]].filter(
        (lemma) => !aggrData[Status.Mastered].has(lemma),
      ).length,
      [Status.Unknown]: [...aggrData[Status.Unknown]].filter(
        (lemma) =>
          !aggrData[Status.Mastered].has(lemma) &&
          !aggrData[Status.Awared].has(lemma),
      ).length,
    };
  }, [lemmas]);

  return (
    <div>
      <h2>Today</h2>

      <SubjShortStats subj={subj} list={list} mode={mode} timestamp={+today} />

      <TimeStats>
        {!!todayDuration.h && <span>{todayDuration.h}:</span>}
        <span>{todayDuration.m}:</span>
        <span>{todayDuration.s}</span>
      </TimeStats>

      <Divider />
      <h2>Total</h2>

      <SubjShortStats subj={subj} list={list} mode={mode} />

      <FullProgress
        stats={lemmasStats}
        targets={[
          { label: 'A1', value: 1000 },
          { label: 'A2', value: 1500 },
          { label: 'B1', value: 3000 },
          { label: 'B2', value: 4000 },
          { label: 'C1', value: 8000 },
        ]}
      />
      <TimeStats>
        {!!totalDuration.h && <span>{totalDuration.h}:</span>}
        <span>{totalDuration.m}:</span>
        <span>{totalDuration.s}</span>
      </TimeStats>

      <Divider />
      <ChartsWrapper>
        <DurChart mode={mode} subj={subj} listId={listId} />
        <StatChart mode={mode} subj={subj} listId={listId} />
      </ChartsWrapper>
    </div>
  );
};

const TimeStats = styled.div`
    margin: 10px 0;
`;

const DurChart = styled(DurationChart)`
    height: 300px;
    width: 0;
    flex-grow: 1;
    min-width: 300px;
`;

const StatChart = styled(StatusChart)`
    height: 300px;
    width: 0;
    flex-grow: 1;
    min-width: 300px;
`;

const ChartsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const FullProgress = styled(LangProgressBar)`
  width:100%;
  margin: 0 0 10px;
`;
