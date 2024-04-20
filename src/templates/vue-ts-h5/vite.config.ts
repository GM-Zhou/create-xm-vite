import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

import packageJson from './package.json' assert { type: 'json' };

const projectName = packageJson.name;
const outputDir = packageJson.yxpm.output;

const ENV = {
  development: {
    PUBLIC_URL: '', // 配置静态资源 url,最终影响 output下的 publicPath（开发环境不需要配置）
    PROXY: 'https://m.test.ximalaya.com',
  },
  test: {
    PUBLIC_URL: `https://static2.test.ximalaya.com/yx/${projectName}/last/${outputDir}/`,
    PROXY: 'https://m.test.ximalaya.com',
  },
  uat: {
    PUBLIC_URL: `https://s1.uat.xmcdn.com/yx/${projectName}/last/${outputDir}/`,
    PROXY: 'https://api.ximalaya.com',
  },
  production: {
    PUBLIC_URL: `https://s1.xmcdn.com/yx/${projectName}/last/${outputDir}/`, // 尽量使用 https，避免运营商劫持资源
    PROXY: 'https://api.ximalaya.com',
  },
};

type NodeEnv = 'development' | 'test' | 'uat' | 'production';

const nodeEnv = process.env.NODE_ENV as NodeEnv;
const buildEnv = ENV[nodeEnv];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: buildEnv.PUBLIC_URL,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      [`/${nodeEnv}`]: {
        target: buildEnv.PROXY,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^/${nodeEnv}`), ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/theme.scss";`,
      },
    },
  },
});
