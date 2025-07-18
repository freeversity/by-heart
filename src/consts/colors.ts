const red = [
  'var(--red-50)',
  'var(--red-100)',
  'var(--red-200)',
  'var(--red-300)',
  'var(--red-400)',
  'var(--red-500)',
  'var(--red-600)',
  'var(--red-700)',
  'var(--red-800)',
  'var(--red-900)',
] as const;

const green = [
  'var(--green-50)',
  'var(--green-100)',
  'var(--green-200)',
  'var(--green-300)',
  'var(--green-400)',
  'var(--green-500)',
  'var(--green-600)',
  'var(--green-700)',
  'var(--green-800)',
  'var(--green-900)',
] as const;

const gray = [
  'var(--gray-50)',
  'var(--gray-100)',
  'var(--gray-200)',
  'var(--gray-300)',
  'var(--gray-400)',
  'var(--gray-500)',
  'var(--gray-600)',
  'var(--gray-700)',
  'var(--gray-800)',
  'var(--gray-900)',
] as const;

const yellow = [
  'var(--yellow-50)',
  'var(--yellow-100)',
  'var(--yellow-200)',
  'var(--yellow-300)',
  'var(--yellow-400)',
  'var(--yellow-500)',
  'var(--yellow-600)',
  'var(--yellow-700)',
  'var(--yellow-800)',
  'var(--yellow-900)',
] as const;

const blue = [
  'var(--blue-50)',
  'var(--blue-100)',
  'var(--blue-200)',
  'var(--blue-300)',
  'var(--blue-400)',
  'var(--blue-500)',
  'var(--blue-600)',
  'var(--blue-700)',
  'var(--blue-800)',
  'var(--blue-900)',
] as const;

const surface = [
  'var(--surface-0)',
  'var(--surface-50)',
  'var(--surface-100)',
  'var(--surface-200)',
  'var(--surface-300)',
  'var(--surface-400)',
  'var(--surface-500)',
  'var(--surface-600)',
  'var(--surface-700)',
  'var(--surface-800)',
  'var(--surface-900)',
] as const;

export const Colors = {
  logoBlue: '#0057b8',
  logoYellow: '#ffd700',
  primary: blue[6],
  mastered: green[7],
  excluded: gray[3],
  gray,
  awared: blue[4],
  unknown: yellow[5],
  red,
  neutral: surface,
  yellow: yellow,
  blue: blue,
  green: green,
} as const;
