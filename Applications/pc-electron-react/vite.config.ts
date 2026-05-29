import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const alias = {
  '@': path.resolve(__dirname, './src'),
  '@shared': path.resolve(__dirname, './shared'),
  '@electron': path.resolve(__dirname, './electron'),
  '@database': path.resolve(__dirname, './database'),
  '@wsserver': path.resolve(__dirname, './wsserver'),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          resolve: { alias },
          build: {
            rollupOptions: {
              external: ['better-sqlite3', 'ws'],
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
        vite: {
          resolve: { alias },
        },
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'test/setup.ts',
    include: ['test/**/*.test.{ts,tsx}'],
    exclude: ['electron/**', 'dist/**', 'dist-electron/**', 'src/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'docs/coverageGen',
      include: [
        'src/**/*.{ts,tsx}',
        'shared/**/*.{ts,tsx}',
        'electron/**/*.{ts,tsx}',
        'database/**/*.{ts,tsx}',
        'wsserver/**/*.{ts,tsx}',
      ],
      exclude: [
        'node_modules/',
        'docs/',
        'src/components/ui/',
        'test/',
        'dist/',
        'dist-electron/',
        '**/*.d.ts',
        '**/*.test.ts',
      ],
    },
  },
  resolve: { alias },
});
