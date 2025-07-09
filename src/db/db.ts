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

export interface DefStatus {
  subj: string;
  term: string;
  status: 'unknown' | 'awared' | 'mastered' | 'excluded';
  mode: string;
  timestamp: number;
  def: string;
}
export interface DefProgressEvent {
  id: number;
  subj: string;
  term: string;
  def: string;
  status: 'unknown' | 'awared' | 'mastered' | 'excluded';
  timestamp: number;
  mode: string;
}

export const db = new Dexie('lists') as Dexie & {
  lists: EntityTable<ListTerm>;
  terms: EntityTable<Term>;
  progress: EntityTable<DefProgressEvent, 'id'>;
  statuses: EntityTable<DefStatus>;
};

db.version(2).stores({
  lists: '[subj+term+list]',
  terms: '[subj+term+def]',
  progress: '++id, subj, def, status, timestamp, mode, term',
  statuses: '[subj+mode+term+def], status, term, timestamp, subj, def, mode',
});
