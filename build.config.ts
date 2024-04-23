import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index.ts'],
  failOnWarn: false,
  clean: true,
  outDir: 'lib',
  rollup: {
    output: {
      format: 'es',
      entryFileNames: '[name].js',
    },
    esbuild: {
      minify: true,
      target: 'ESNEXT',
    },
  },
});
