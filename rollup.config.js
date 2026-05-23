import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'lib/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'lib/mjs/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    postcss({
      plugins: [],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
    }),
  ],
};
