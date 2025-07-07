import axios from 'axios';

export interface WordDefinition {
  title: string;
  ipas: string[];
  audios: Array<{ name: string; url: string }>;
  types: Array<
    | {
        type: 'pronoun' | 'noun' | 'prep' | 'conj' | 'adj';
        initial: string | string[] | null;
        forms: Array<{
          g: 'm' | 'f' | 'n';
          n: 's' | 'p';
        }>;
        trans?: string[];
        html?: string;
      }
    | {
        type: 'verb';
        initial: string | string[] | null;
        forms: Array<{
          mod: string;
          tense: string;
          aux: string[];
          pronom: boolean;
          impers: boolean;
        }>;
        trans?: string[];
        html?: string;
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
