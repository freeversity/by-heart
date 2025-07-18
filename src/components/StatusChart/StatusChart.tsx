import { Chart, registerables } from 'chart.js';
import { useLiveQuery } from 'dexie-react-hooks';
import { type FC, useMemo } from 'react';
import { type ChartProps, Line } from 'react-chartjs-2';

import { styled } from '@linaria/react';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { db } from '../../db';
import { Status } from '../../db/db';
import { currentListAtom } from '../../state/currentList/atoms';

Chart.register(...registerables);

export const StatusChart: FC<{
  mode: string;
  subj: string;
  listId: string;
  className?: string;
}> = ({ mode, subj, listId, className }) => {
  const [list] = useAtom(currentListAtom({ subj, id: listId }));

  const today = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    return new Date(year, month, day);
  }, []);

  const statuses = useLiveQuery(() => {
    const set = new Set(list);

    return db.statuses
      .where({ subj, mode })
      .and(({ term }) => set.has(term))
      .toArray();
  }, [mode, list]);

  const monthDates = useMemo(
    () =>
      new Array(31)
        .fill(null)
        .map(
          (_, index) =>
            +new Date(new Date(+today).setDate(today.getDate() - index)),
        )
        .reverse(),
    [today],
  );

  const monthEventsByDay = useMemo(() => {
    const monthAgo = monthDates[0] ?? 0;

    const initData = monthDates.reduce<
      Record<number, Record<Exclude<Status, 'excluded'>, number>>
    >((initData, value) => {
      initData[value] = {
        [Status.Mastered]: 0,
        [Status.Awared]: 0,
        [Status.Unknown]: 0,
      };

      return initData;
    }, {});

    return (
      statuses
        ?.filter(({ timestamp }) => timestamp > monthAgo)
        .reduce<Record<number, Record<Exclude<Status, 'excluded'>, number>>>(
          (eventStats, { timestamp, status }) => {
            const date = new Date(timestamp);

            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            const dayDate = +new Date(year, month, day);

            if (status === Status.Excluded) return eventStats;

            if (!eventStats[dayDate]) {
              eventStats[dayDate] = {
                [Status.Mastered]: 0,
                [Status.Awared]: 0,
                [Status.Unknown]: 0,
              };
            }

            eventStats[dayDate][status] += 1;

            return eventStats;
          },
          initData,
        ) ?? {}
    );
  }, [statuses, monthDates]);

  const data = useMemo<ChartProps<'line'>['data']>(
    () => ({
      labels: monthDates,
      datasets: [
        {
          label: 'Unknown',
          data: Object.values(monthEventsByDay).map(({ unknown }) => unknown),
          borderColor: window
            .getComputedStyle(document.body)
            .getPropertyValue('--yellow-500'),
          backgroundColor: window
            .getComputedStyle(document.body)
            .getPropertyValue('--yellow-500'),
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'Awared',
          data: Object.values(monthEventsByDay).map(
            ({ awared, unknown }) => awared + unknown,
          ),
          borderColor: window
            .getComputedStyle(document.body)
            .getPropertyValue('--blue-400'),
          backgroundColor: window
            .getComputedStyle(document.body)
            .getPropertyValue('--blue-400'),
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'Mastered',
          data: Object.values(monthEventsByDay).map(
            ({ mastered, unknown, awared }) => mastered + unknown + awared,
          ),
          borderColor: window
            .getComputedStyle(document.body)
            .getPropertyValue('--green-700'),
          backgroundColor: window
            .getComputedStyle(document.body)
            .getPropertyValue('--green-700'),
          fill: true,
          pointRadius: 0,
        },
      ],
    }),
    [monthDates, monthEventsByDay],
  );

  const options = useMemo<ChartProps<'line'>['options']>(
    () => ({
      plugins: {
        legend: { display: false },
      },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Statuses' },
          min: monthDates[0],
          max: monthDates.at(-1),
          ticks: {
            stepSize: 1000 * 60 * 60 * 24,
            callback: (value) => {
              return dayjs(monthDates[+value]).format('DD MMM');
            },
          },
        },
        y: {
          min: 0,
          stacked: true,
          position: 'right',
          ticks: {
            stepSize: 1,
          },
        },
      },
    }),
    [monthDates],
  );

  return (
    <Container className={className}>
      <Line data={data} options={options} />
    </Container>
  );
};

const Container = styled.div`   
    max-height: 500px;
`;
