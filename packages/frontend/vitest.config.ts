import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [...configDefaults.exclude, 'tests/e2e/*'],
  },
});
