import { defineBuildConfig } from 'unbuild';

// export default defineBuildConfig([
//   {
//     entries: ['src/index.ts'],
//     failOnWarn: false,
//     clean: true,
//     outDir: 'lib',
//     rollup: {
//       output: {
//         format: 'cjs',
//         entryFileNames: '[name].js',
//       },
//     },
//   },
//   {
//     entries: ['src/index.ts'],
//     failOnWarn: false,
//     clean: true,
//     outDir: 'lib',
//     rollup: {
//       output: {
//         format: 'esm',
//         entryFileNames: '[name].mjs',
//       },
//     },
//   },
// ]);

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
