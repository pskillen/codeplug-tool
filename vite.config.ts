/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildEnv = process.env.BUILD_ENV || 'local';
const buildVersion = (process.env.BUILD_VERSION || 'local').replace(/^v/, '');

export default defineConfig({
  base: '/codeplug-tool/',
  plugins: [react()],
  define: {
    __BUILD_ENV__: JSON.stringify(buildEnv),
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/**/*.d.ts'],
      reporter: ['text', 'json-summary', 'lcov'],
    },
  },
});
