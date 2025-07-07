import { normalizeString } from '../../utils/normilize';

export function splitBySearchTerm(word: string, query: string) {
  const normalizedQuery = normalizeString(query);

  return word
    .split('')
    .reduce<Array<{ frag: string; match: boolean }>>((result, char) => {
      let lastFrag = result.at(-1);

      if (!lastFrag) {
        lastFrag = { frag: '', match: false };
        result.push(lastFrag);
      }

      const normFrag = normalizeString(lastFrag.frag + char);
      const normPrevFrag = normalizeString(lastFrag.frag);

      if (normalizedQuery === normFrag) {
        lastFrag.frag += char;
        lastFrag.match = true;
        result.push({ frag: '', match: false });
      } else if (
        !normalizedQuery.startsWith(normPrevFrag) &&
        normalizedQuery.startsWith(normalizeString(char))
      ) {
        result.push({ frag: char, match: false });
      } else {
        lastFrag.frag += char;
      }

      return result;
    }, []);
}
