import axios from 'axios';

export interface Question {
  answer: number;
  audio: string[];
  images: string[];
  index: string;
  options: string[];
  text: string | null;
  points: number;
}

export interface Test {
  id: string;
  questions: Question[];
  timeout: number;
  benchmarks: Array<{
    name: string;
    title: string;
    levels: Array<{
      name: string;
      title: string;
      min: number;
      max: number;
    }>;
  }>;
}

export async function getTest(id: string) {
  const { data } = await axios.get<Test>(
    `https://cdn.freeversity.io/tests/${id}.json`,
  );

  return data;
}

export async function getQuestionText(testId: string, fileName: string) {
  const { data } = await axios.get<string>(
    `https://cdn.freeversity.io/tests/${testId}/${fileName}`,
  );

  return data;
}
