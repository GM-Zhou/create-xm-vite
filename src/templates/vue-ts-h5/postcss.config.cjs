
module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    // 配置参考：https://github.com/evrone/postcss-px-to-viewport
    // require('postcss-px-to-viewport-8-plugin')({
    //   unitToConvert: 'px',
    //   viewportWidth: 375,
    // }),
    require('postcss-pxtorem')({
      rootValue: 20,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 2,
      exclude: /node_modules/i,
    }),
  ],
};
