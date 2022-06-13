import { externalModules } from '@run-z/rollup-helpers';
import { defineConfig } from 'rollup';
import flatDts from 'rollup-plugin-flat-dts';
import sourcemaps from 'rollup-plugin-sourcemaps';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

export default defineConfig({
  input: {
    logger: './src/mod.ts',
  },
  plugins: [
    ts({
      typescript,
      tsconfig: 'tsconfig.main.json',
      cacheRoot: 'target/.rts2_cache',
    }),
    sourcemaps(),
  ],
  external: externalModules(),
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    plugins: [
      flatDts({
        tsconfig: 'tsconfig.main.json',
        lib: ['ES2022'],
        file: 'logger.d.ts',
        compilerOptions: {
          declarationMap: true,
        },
        internal: ['**/impl/**', '**/*.impl'],
      }),
    ],
  },
});
