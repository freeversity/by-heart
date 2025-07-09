import axios from 'axios';

export const FrMod = {
  Indc: 'indc',
  Subj: 'subj',
  Cond: 'cond',
  Part: 'part',
  Infn: 'inf',
  Gern: 'gern',
} as const;

export type FrMod = (typeof FrMod)[keyof typeof FrMod];

export const FrTense = {
  Pres: 'pres',
  PassC: 'pass-c',
  Impf: 'impf',
  Pqpf: 'pqpf',
  PassS: 'pass-s',
  PassA: 'pass-a',
  Futr: 'futr',
  FutrA: 'futr-a',
  SubjPr: 'subj-pr',
  SubjPs: 'subj-ps',
  SubjIm: 'subj-im',
  SubjPq: 'subj-pq',
  CondPr: 'cond-pr',
  CondPp: 'cond-pp',
  CondPd: 'cond-pd',
  ImprPr: 'impr-pr',
  ImprPs: 'impr-ps',
  PartPr: 'part-pr',
  PartPs: 'part-ps',
  InfnPr: 'inf-pr',
  InfnPs: 'inf-ps',
  GernPr: 'gern-pr',
  GernPs: 'gern-ps',
} as const;

export type FrTense = (typeof FrTense)[keyof typeof FrTense];

export interface WordConjugation {
  mod: FrMod;
  tenses: Array<{ tense: FrTense; forms: string[][] }>;
}

export interface WordDefinition {
  title: string;
  ipas?: string[];
  audios?: Array<{ name: string; url: string }>;
  types: Array<
    | {
        type: 'pronoun' | 'noun' | 'prep' | 'conj' | 'adj';
        initial: string | null;
        forms: Array<{
          g: 'm' | 'f' | 'n';
          n: 's' | 'p';
        }>;
        trans?: string[];
        html?: string;
        preps?: Array<{ rel: string; prep: string; ex: string }>;
        conj?: undefined;
      }
    | {
        type: 'verb';
        initial: string | null;
        forms: Array<{
          m: string;
          t: string;
          p: string;
          n: string;
          aux: string[];
          pronom: boolean;
          impers: boolean;
        }>;
        trans?: string[];
        html?: string;
        preps?: Array<{ rel: string; prep: string; ex: string }>;
        conj?: WordConjugation[];
      }
  >;
}

export async function getDef(subj: string, def: string) {
  const utf8Bytes = new TextEncoder().encode(def);

  const defId = btoa(String.fromCharCode(...utf8Bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const { data } = await axios.get<WordDefinition>(
    `https://wiktionary.freeversity.io/v0/${subj}/defs/${defId}.json`,
  );

  return {
    ...data,
    types: data.types.map(({ trans, ...type }) => ({
      ...type,
      trans: [...new Set(trans)],
    })),
  };
}
