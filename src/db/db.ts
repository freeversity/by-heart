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

export interface DefProgressEvent {
  id: number;
  subj: string;
  def: string;
  status: 'unknown' | 'awared' | 'mastered' | 'excluded';
  timestamp: number;
  mode: string;
}

export const db = new Dexie('lists') as Dexie & {
  lists: EntityTable<ListTerm>;
  terms: EntityTable<Term>;
  progress: EntityTable<DefProgressEvent, 'id'>;
};

db.version(1).stores({
  lists: 'subj, list, term',
  terms: 'subj, term, def',
  progress: '++id, subj, status, timestamp',
});
