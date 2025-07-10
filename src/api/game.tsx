import {
  AWARED_PROB,
  AWARED_TIMEOUT_MS,
  MASTERED_PROB,
  MASTERED_TIMEOUT_MS,
  NEW_WORD_DRAW_SIZE,
  REVERSE_TERM_TIMEOUT_MS,
  UNKNOWN_PROB,
  UNKNOWN_TIMEOUT_MS,
} from '../consts/discovery';
import { type Status, db } from '../db/db';
import { getDef } from './defs';

export async function getNextForward({
  list,
  subj,
  term,
  status,
}: {
  list: string[];
  subj: string;
  term?: string | null;
  status?: Status;
}) {
  const listSet = new Set(list);

  if (term && status) {
    await Promise.all([
      db.progress.add({
        def: '',
        subj,
        term: term,
        status: status,
        timestamp: Date.now(),
        mode: 'forward',
      }),
      db.statuses.put({
        def: '',
        subj,
        term: term,
        status: status,
        timestamp: Date.now(),
        mode: 'forward',
      }),
    ]);
  }

  const [allIntroduced, staledMastered, staledAwared, staledUnknown] =
    await Promise.all([
      db.statuses
        .where({ subj, mode: 'forward' })
        .and((item) => item.mode === 'forward' && listSet.has(item.term))
        .toArray(),

      db.statuses
        .where('timestamp')
        .below(Date.now() - MASTERED_TIMEOUT_MS)
        .and(
          (item) =>
            item.mode === 'forward' &&
            item.subj === subj &&
            item.status === 'mastered' &&
            listSet.has(item.term),
        )
        .toArray(),
      db.statuses
        .where('timestamp')
        .below(Date.now() - AWARED_TIMEOUT_MS)
        .and(
          (item) =>
            item.mode === 'forward' &&
            item.subj === subj &&
            item.status === 'awared' &&
            listSet.has(item.term),
        )
        .toArray(),
      db.statuses
        .where('timestamp')
        .below(Date.now() - UNKNOWN_TIMEOUT_MS)
        .and(
          (item) =>
            item.mode === 'forward' &&
            item.subj === subj &&
            item.status === 'unknown' &&
            listSet.has(item.term),
        )
        .toArray(),
    ]);

  const random = Math.floor(Math.random() * 100);

  let nextDef: string | undefined;

  if (random < MASTERED_PROB && staledMastered.length) {
    const randomIndex = Math.floor(Math.random() * staledMastered.length);

    nextDef = staledMastered[randomIndex]?.term;
  } else if (random < AWARED_PROB && staledAwared.length) {
    const randomIndex = Math.floor(Math.random() * staledAwared.length);

    nextDef = staledAwared[randomIndex]?.term;
  } else if (random < UNKNOWN_PROB && staledUnknown.length) {
    const randomIndex = Math.floor(Math.random() * staledUnknown.length);

    nextDef = staledUnknown[randomIndex]?.term;
  } else {
    const introducedSet = new Set(allIntroduced.map(({ term }) => term));

    const listToChoose = list
      .filter((def) => !introducedSet.has(def))
      .slice(0, NEW_WORD_DRAW_SIZE);

    const randomIndex = Math.floor(Math.random() * listToChoose.length);

    nextDef = listToChoose[randomIndex];
  }

  return nextDef;
}

export async function getNextReverse({
  list,
  subj,
  term,
  status,
  def,
  mode = 'reverse',
}: {
  list: string[];
  subj: string;
  term?: string | null;
  def?: string | null;
  status?: Status;
  mode?: string;
}) {
  const listSet = new Set(list);

  let exhausted = false;

  if (term) {
    const [fullDef, termStatuses] = await Promise.all([
      getDef(subj, term),
      db.statuses
        .where({
          subj,
          term,
          mode,
        })
        .toArray(),
    ]);

    const translations =
      fullDef.types.flatMap(({ trans }) => trans ?? []) ?? [];

    exhausted = translations.every((trans) =>
      termStatuses.some(({ def }) => def === trans),
    );
  }

  if (term && status && def) {
    await Promise.all([
      db.progress.add({
        def: def,
        subj,
        term: term,
        status: status,
        timestamp: Date.now(),
        mode,
      }),
      db.statuses.put({
        def: def,
        subj,
        term: term,
        status: status,
        timestamp: Date.now(),
        mode,
      }),
      ...(exhausted
        ? [
            db.statuses.put({
              def: '',
              subj,
              term: term,
              status: 'excluded',
              timestamp: Date.now(),
              mode,
            }),
          ]
        : []),
    ]);
  }

  const [exhaustedDefs, staledMastered, staledAwared, staledUnknown] =
    await Promise.all([
      db.statuses
        .where({ subj, mode })
        .and(
          (item) =>
            listSet.has(item.term) &&
            (!item.def ||
              item.timestamp > Date.now() - REVERSE_TERM_TIMEOUT_MS),
        )
        .toArray(),

      db.statuses
        .where('timestamp')
        .below(Date.now() - MASTERED_TIMEOUT_MS)
        .and(
          (item) =>
            item.mode === mode &&
            item.subj === subj &&
            item.status === 'mastered' &&
            !!item.def &&
            listSet.has(item.term),
        )
        .toArray(),
      db.statuses
        .where('timestamp')
        .below(Date.now() - AWARED_TIMEOUT_MS)
        .and(
          (item) =>
            item.mode === mode &&
            item.subj === subj &&
            item.status === 'awared' &&
            !!item.def &&
            listSet.has(item.term),
        )
        .toArray(),
      db.statuses
        .where('timestamp')
        .below(Date.now() - UNKNOWN_TIMEOUT_MS)
        .and(
          (item) =>
            item.mode === mode &&
            item.subj === subj &&
            item.status === 'unknown' &&
            !!item.def &&
            listSet.has(item.term),
        )
        .toArray(),
    ]);

  const random = Math.floor(Math.random() * 100);

  let nextPair: { def: string; term: string } | undefined;

  if (random < MASTERED_PROB && staledMastered.length) {
    const randomIndex = Math.floor(Math.random() * staledMastered.length);

    const { term, def } = staledMastered[randomIndex] ?? {};

    nextPair = term && def ? { term, def } : undefined;
  } else if (random < AWARED_PROB && staledAwared.length) {
    const randomIndex = Math.floor(Math.random() * staledAwared.length);

    const { term, def } = staledAwared[randomIndex] ?? {};

    nextPair = term && def ? { term, def } : undefined;
  } else if (random < UNKNOWN_PROB && staledUnknown.length) {
    const randomIndex = Math.floor(Math.random() * staledUnknown.length);

    const { term, def } = staledUnknown[randomIndex] ?? {};

    nextPair = term && def ? { term, def } : undefined;
  } else {
    const excluded = new Set();
    const exhaustedSet = new Set(exhaustedDefs.map(({ term }) => term));

    const listToChoose = list
      .filter((def) => !exhaustedSet.has(def) && !excluded.has(def))
      .slice(0, NEW_WORD_DRAW_SIZE);

    const randomIndex = Math.floor(Math.random() * listToChoose.length);

    const initTerm = listToChoose[randomIndex];

    if (!initTerm) return;

    let nextTerm = initTerm;

    while (!nextPair) {
      const [statuses, definition] = await Promise.all([
        db.statuses.where({ subj, mode, term: nextTerm }).toArray(),
        getDef(subj, nextTerm),
      ]);

      const introducedDefs = new Set(statuses.map(({ def }) => def));
      const availableLemmas = definition.types
        .map(({ initial }) => initial)
        .filter(
          (lemma): lemma is string => !!lemma && !exhaustedSet.has(lemma),
        );

      const availableTranslations = definition.types
        .flatMap(({ trans }) => trans ?? [])
        .filter((trans) => !introducedDefs.has(trans));

      if (!availableTranslations.length) {
        await db.statuses.put({
          def: '',
          subj,
          term: nextTerm,
          status: 'excluded',
          timestamp: Date.now(),
          mode,
        });
        excluded.add(nextTerm);

        if (!availableLemmas.length) {
          const listToChoose = list
            .filter((def) => !exhaustedSet.has(def) && !excluded.has(def))
            .slice(0, NEW_WORD_DRAW_SIZE);

          const randomIndex = Math.floor(Math.random() * listToChoose.length);

          const term = listToChoose[randomIndex];

          if (!term) return;

          nextTerm = term;

          continue;
        }
      }

      if (!availableTranslations.length) {
        const randomIndex = Math.floor(Math.random() * availableLemmas.length);

        const listToChoose = list
          .filter((def) => !exhaustedSet.has(def) && !excluded.has(def))
          .slice(0, NEW_WORD_DRAW_SIZE);

        const randomListIndex = Math.floor(Math.random() * listToChoose.length);

        const term = availableLemmas[randomIndex] ?? list[randomListIndex];

        if (!term) return;

        nextTerm = term;

        continue;
      }

      const randomIndex = Math.floor(
        Math.random() * availableTranslations.length,
      );

      const def = availableTranslations[randomIndex];

      if (!def) {
        const listToChoose = list
          .filter((def) => !exhaustedSet.has(def) && !excluded.has(def))
          .slice(0, NEW_WORD_DRAW_SIZE);

        const randomIndex = Math.floor(Math.random() * listToChoose.length);

        const term = listToChoose[randomIndex];
        if (!term) return;

        nextTerm = term;

        continue;
      }

      nextPair = { term: nextTerm, def };
    }
  }

  return nextPair;
}
