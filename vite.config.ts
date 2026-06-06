import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/modules',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/test',
          environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
});