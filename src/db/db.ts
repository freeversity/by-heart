import Dexie, { type EntityTable } from 'dexie';

export interface Term {
  subj: string;
  term: string;
  def: string;
}

export interface ListTerm {
  list: string;
  subj: string;
  term: string;
}

export interface TermProgress {
  subj: string;
  term: string;
  added: number;
  awared: number;
  mastered: number;
  excluded: number;
}

export const db = new Dexie('lists') as Dexie & {
  lists: EntityTable<ListTerm>;
  terms: EntityTable<Term>;
  progress: EntityTable<TermProgress>;
};

db.version(1).stores({
  lists: 'subj, list, term',
  terms: 'subj, term, def',
  progress: 'subj, term, added, awared, mastered, ecluded',
});
