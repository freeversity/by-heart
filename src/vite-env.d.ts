/// <reference types="vite/client" />

import 'react';

declare module 'react' {
  export interface CSSProperties {
    '--viewport-bottom'?: `${number}px`;
    '--viewport-top'?: `${number}px`;
  }
}
