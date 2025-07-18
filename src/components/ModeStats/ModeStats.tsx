import { styled } from '@linaria/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Divider } from 'primereact/divider';
import { type FC, useMemo } from 'react';
import { db } from '../../db';
import { formatDuration } from '../../utils/formatDuration';
import { DurationChart } from '../DurationChart';
import { StatusChart } from '../StatusChart';
import { SubjShortStats } from '../SubjShortStats';

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
