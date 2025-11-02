import axios from 'axios';

export async function getList(subj: string, list: string) {
  if (list === 'tcf') return tcfTests;
  const { data } = await axios.get<string[]>(
    `https://wiktionary.freeversity.io/v0/${subj}/sets/${list}.json`,
  );

  return data;
}

const tcfTests = [
  ...new Array(40).fill(null).map((_item, index) => ({
    type: 'listening' as const,
    id: `listening-${index + 1}`,
    title: `Compréhension orale #${index + 1}`,
  })),
  ...new Array(40).fill(null).map((_item, index) => ({
    type: 'reading' as const,
    id: `reading-${index + 1}`,
    title: `Compréhension ecrit #${index + 1}`,
  })),
];
