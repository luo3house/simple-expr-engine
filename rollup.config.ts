import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'rollup';
// @ts-ignore
import bundleSize from 'rollup-plugin-bundle-size';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/umd/index.min.js',
      name: 'simple_expr_engine',
      format: 'umd',
      plugins: [terser()],
    },
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
  ],
  plugins: [
    bundleSize(),
    resolve({
      extensions: ['.ts'],
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
    }),
  ],
});
