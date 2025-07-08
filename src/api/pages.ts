import axios from 'axios';

export async function getPage(subj: string, page: number) {
  const { data } = await axios.get<{
    prev: number | null;
    next: number | null;
    total: number;
    content: string[];
  }>(`https://wiktionary.freeversity.io/v0/${subj}/pages/${page}.json`);

  return data;
}
