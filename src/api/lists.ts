import axios from 'axios';

export async function getList(subj: string, list: string) {
  const { data } = await axios.get<string[]>(
    `https://wiktionary.freeversity.io/v0/${subj}/sets/${list}.json`,
  );

  return data;
}
