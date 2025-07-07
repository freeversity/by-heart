export function normalizeString(str: string) {
  return (
    str
      .normalize('NFD')
      .toLowerCase()
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: we have to exclude diacritics for fetching search set
      .replace(/[\u0300-\u036f]/g, '')
  );
}
