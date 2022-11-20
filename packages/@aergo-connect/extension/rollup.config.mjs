import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default {
  input: 'src/background/background.ts',
  output: {
    dir: 'dist-dev',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [commonjs(), json(), builtins(), nodeResolve({
    preferBuiltins: false,
  }), typescript(), globals()],
};