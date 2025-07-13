import {
  AWARED_TIMEOUT_MS,
  MASTERED_TIMEOUT_MS,
  NEW_WORD_DRAW_SIZE,
  REVERSE_TERM_TIMEOUT_MS,
  UNKNOWN_TIMEOUT_MS,
} from '../consts/discovery';
import { Status, db } from '../db/db';
import { pickTermCategory } from '../utils/pickTermCategory';
import { getDef } from './defs';

export async function getNextForward({
  list,
  subj,
  term,
  status,
  type,
  lemma,
}: {
  list: string[];
  subj: string;
  term?: string | null;
  type?: string;
  lemma?: string | null;
  status?: Status;
}): Promise<{
  term: string;
  lemma: string | null;
  type: string;
}> {
  const listSet = new Set(list);

  let exhausted = false;

  if (term) {
    const [fullDef, termStatuses] = await Promise.all([
      getDef(subj, term),
      db.statuses
        .where({
          subj,
          term,
          mode: 'forward',
        })
        .toArray(),
    ]);

    const types = fullDef.types.map(({ type }) => type) ?? [];

    exhausted = types.every((type) =>
      termStatuses.some((status) => status.type === type),
    );
  }

  if (term && status && type) {
    await Promise.all([
      db.progress.add({
        def: '',
        subj,
        term: term,
        status: status,
        timestamp: Date.now(),
        type,
        lemma: lemma ?? '',
        mode: 'forward',
      }),
      db.statuses.put({
        def: '',
        subj,
        term: term,
        status: status,
        timestamp: Date.now(),
        type,
        lemma: lemma ?? '',
        mode: 'forward',
      }),
      ...(exhausted
        ? [
            db.statuses.put({
              def: '',
              subj,
              term: term,
              status: 'excluded',
              timestamp: Date.now(),
              type: '',
              lemma: '',
              mode: 'forward',
            }),
          ]
        : []),
    ]);
  }

  const [exhaustedDefs, staledMastered, staledAwared, staledUnknown] =
    await Promise.all([
      db.statuses
        .where({ subj, mode: 'forward' })
        .and(
          (item) =>
            listSet.has(item.term) &&
            (!item.type ||
              item.timestamp > Date.now() - REVERSE_TERM_TIMEOUT_MS),
        )
        .toArray(),

      db.statuses
        .where('timestamp')
        .below(Date.now() - MASTERED_TIMEOUT_MS)
        .and(
          (item) =>
            item.mode === 'forward' &&
            item.subj === subj &&
            item.status === 'mastered' &&
            !!item.type &&
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
            !!item.type &&
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
            !!item.type &&
            listSet.has(item.term),
        )
        .toArray(),
    ]);

  const introducedSet = new Set(exhaustedDefs.map(({ term }) => term));

  const newTerms = list
    .filter((def) => !introducedSet.has(def))
    .slice(0, NEW_WORD_DRAW_SIZE);

  const newTermCat = pickTermCategory({
    masteredCount: staledMastered.length,
    awaredCount: staledAwared.length,
    unknownCount: staledUnknown.length,
    newCount: newTerms.length,
  });

  switch (newTermCat) {
    case Status.Mastered: {
      const randomIndex = Math.floor(Math.random() * staledMastered.length);

      const term = staledMastered[randomIndex];

      if (!term)
        throw new Error(
          `Something went wrong. Random mastered term not found (${randomIndex}/${staledMastered.length}).`,
        );

      return { term: term.term, lemma: term.lemma, type: term.type };
    }
    case Status.Awared: {
      const randomIndex = Math.floor(Math.random() * staledAwared.length);

      const term = staledMastered[randomIndex];

      if (!term)
        throw new Error(
          `Something went wrong. Random awared term not found (${randomIndex}/${staledAwared.length}).`,
        );

      return { term: term.term, lemma: term.lemma, type: term.type };
    }
    case Status.Unknown: {
      const randomIndex = Math.floor(Math.random() * staledUnknown.length);

      const term = staledMastered[randomIndex];

      if (!term)
        throw new Error(
          `Something went wrong. Random unknown term not found (${randomIndex}/${staledUnknown.length}).`,
        );

      return { term: term.term, lemma: term.lemma, type: term.type };
    }
    default: {
      {
        const randomIndex = Math.floor(Math.random() * newTerms.length);

        const initTerm = newTerms[randomIndex];

        if (!initTerm)
          throw new Error(
            `Something went wrong. Random new term not found (${randomIndex}/${newTerms.length}).`,
          );

        let nextTerm = initTerm;

        let nextResult:
          | {
              term: string;
              lemma: string | null;
              type: string;
            }
          | undefined;

        while (!nextResult) {
          const [statuses, definition] = await Promise.all([
            db.statuses
              .where({ subj, mode: 'forward', term: nextTerm })
              .toArray(),
            getDef(subj, nextTerm),
          ]);

          const introducedTypes = new Set(statuses.map(({ type }) => type));

          const availableTypes = definition.types
            .flatMap(({ type, initial }) => ({ type: type, lemma: initial }))
            .filter(({ type }) => !introducedTypes.has(type));

          if (!definition.types.length) {
            nextResult = { type: '', term: nextTerm, lemma: null };
            break;
          }
          if (!availableTypes.length) {
            await db.statuses.put({
              def: '',
              subj,
              term: nextTerm,
              status: 'excluded',
              timestamp: Date.now(),
              type: '',
              lemma: '',
              mode: 'forward',
            });
            introducedSet.add(nextTerm);

            const listToChoose = list
              .filter((def) => !introducedSet.has(def))
              .slice(0, NEW_WORD_DRAW_SIZE);

            const randomListIndex = Math.floor(
              Math.random() * listToChoose.length,
            );

            const term = listToChoose[randomListIndex];

            if (!term)
              throw new Error(
                `Something went wrong. Random new term not found (${randomListIndex}/${listToChoose.length}).`,
              );

            nextTerm = term;

            continue;
          }

          const randomIndex = Math.floor(Math.random() * availableTypes.length);

          const def = availableTypes[randomIndex];

          if (!def) {
            const listToChoose = list
              .filter((def) => !introducedSet.has(def))
              .slice(0, NEW_WORD_DRAW_SIZE);

            const randomIndex = Math.floor(Math.random() * listToChoose.length);

            const term = listToChoose[randomIndex];

            if (!term)
              throw new Error(
                `Something went wrong. Random new term not found (${randomIndex}/${listToChoose.length}).`,
              );

            nextTerm = term;

            continue;
          }

          nextResult = { term: nextTerm, ...def };
        }

        return nextResult;
      }
    }
  }
}

export async function getNextReverse({
  list,
  subj,
  term,
  status,
  def,
  mode = 'reverse',
  type,
  lemma,
}: {
  list: string[];
  subj: string;
  term?: string | null;
  def?: string | null;
  status?: Status;
  mode?: string;
  type?: string | null;
  lemma?: string | null;
}): Promise<{
  def: string;
  term: string;
  lemma: string | null;
  type: string;
}> {
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
        type: type ?? '',
        lemma: lemma ?? '',
        mode,
      }),
      db.statuses.put({
        def: def,
        subj,
        term: term,
        status: status,
        timestamp: Date.now(),
        type: type ?? '',
        lemma: lemma ?? '',
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
              type: '',
              lemma: '',
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

  const excluded = new Set();
  const exhaustedSet = new Set(exhaustedDefs.map(({ term }) => term));

  const listToChoose = list
    .filter((def) => !exhaustedSet.has(def) && !excluded.has(def))
    .slice(0, NEW_WORD_DRAW_SIZE);

  const newTermCat = pickTermCategory({
    masteredCount: staledMastered.length,
    awaredCount: staledAwared.length,
    unknownCount: staledUnknown.length,
    newCount: listToChoose.length,
  });

  let nextPair:
    | { def: string; term: string; lemma: string | null; type: string }
    | undefined;

  if (newTermCat === Status.Mastered) {
    const randomIndex = Math.floor(Math.random() * staledMastered.length);

    const nextTerm = staledMastered[randomIndex];

    if (!nextTerm)
      throw new Error(
        `Something went wrong. Random mastered term not found (${randomIndex}/${staledMastered.length}).`,
      );

    nextPair = {
      term: nextTerm.term,
      def: nextTerm.def,
      lemma: nextTerm.lemma,
      type: nextTerm.type,
    };
  } else if (newTermCat === Status.Awared) {
    const randomIndex = Math.floor(Math.random() * staledAwared.length);

    const nextTerm = staledAwared[randomIndex];

    if (!nextTerm)
      throw new Error(
        `Something went wrong. Random awared term not found (${randomIndex}/${staledAwared.length}).`,
      );

    nextPair = {
      term: nextTerm.term,
      def: nextTerm.def,
      lemma: nextTerm.lemma,
      type: nextTerm.type,
    };
  } else if (newTermCat === Status.Unknown) {
    const randomIndex = Math.floor(Math.random() * staledUnknown.length);

    const nextTerm = staledUnknown[randomIndex];

    if (!nextTerm)
      throw new Error(
        `Something went wrong. Random unknown term not found (${randomIndex}/${staledUnknown.length}).`,
      );

    nextPair = {
      term: nextTerm.term,
      def: nextTerm.def,
      lemma: nextTerm.lemma,
      type: nextTerm.type,
    };
  } else {
    const randomIndex = Math.floor(Math.random() * listToChoose.length);

    const initTerm = listToChoose[randomIndex];

    if (!initTerm)
      throw new Error(
        `Something went wrong. Random new term not found (${randomIndex}/${listToChoose.length}).`,
      );

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
        .flatMap(
          ({ trans, type, initial }) =>
            trans.map((def) => ({ def, type: type, lemma: initial })) ?? [],
        )
        .filter(({ def }) => !introducedDefs.has(def));

      if (!availableTranslations.length) {
        await db.statuses.put({
          def: '',
          subj,
          term: nextTerm,
          status: 'excluded',
          timestamp: Date.now(),
          type: '',
          lemma: '',
          mode,
        });
        excluded.add(nextTerm);

        if (!availableLemmas.length) {
          const listToChoose = list
            .filter((def) => !exhaustedSet.has(def) && !excluded.has(def))
            .slice(0, NEW_WORD_DRAW_SIZE);

          const randomIndex = Math.floor(Math.random() * listToChoose.length);

          const term = listToChoose[randomIndex];

          if (!term)
            throw new Error(
              `Something went wrong. Random new term not found (${randomIndex}/${listToChoose.length}).`,
            );

          nextTerm = term;

          continue;
        }
      }

      if (!availableTranslations.length) {
        await db.statuses.put({
          def: '',
          subj,
          term: nextTerm,
          status: 'excluded',
          timestamp: Date.now(),
          type: '',
          lemma: '',
          mode,
        });
        excluded.add(nextTerm);

        const randomIndex = Math.floor(Math.random() * availableLemmas.length);

        const listToChoose = list
          .filter((def) => !exhaustedSet.has(def) && !excluded.has(def))
          .slice(0, NEW_WORD_DRAW_SIZE);

        const randomListIndex = Math.floor(Math.random() * listToChoose.length);

        const term =
          availableLemmas[randomIndex] ?? listToChoose[randomListIndex];

        if (!term)
          throw new Error(
            `Something went wrong. Random new term not found (${randomIndex}/${listToChoose.length}).`,
          );

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

        if (!term)
          throw new Error(
            `Something went wrong. Random new term not found (${randomIndex}/${listToChoose.length}).`,
          );

        nextTerm = term;

        continue;
      }

      nextPair = { term: nextTerm, ...def };
    }
  }

  return nextPair;
}
