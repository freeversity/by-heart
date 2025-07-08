import react from '@vitejs/plugin-react-swc';
import wyw from '@wyw-in-js/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    outDir: './docs',
  },
  plugins: [
    react(),
    wyw({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    checker({ typescript: true, biome: true }),
    viteStaticCopy({
      targets: [
        {
          src: './docs/index.html',
          dest: './',
          rename: '404.html',
        },
        {
          src: './CNAME',
          dest: './',
        },
      ],
    }),
  ],
});
