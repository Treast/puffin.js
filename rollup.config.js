import scss from 'rollup-plugin-scss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
// import pkg from './package.json';

export default [
  {
    input: 'src/Puffin.js',
    output: [
      {
        name: 'Puffin',
        file: 'dist/puffin.min.js',
        format: 'iife',
        compact: true,
      },
    ],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs(),
      scss({
        outputStyle: 'compressed',
      }),
      terser(),
    ],
  },
];
