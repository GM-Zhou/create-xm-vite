import react from '@vitejs/plugin-react-swc';
import million from 'million/compiler';
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

const mode = process.env.CURRENT_MODE as 'development' | 'test' | 'uat' | 'production';
const buildEnv = ENV[mode];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [million.vite({ auto: true }), react()],
  base: buildEnv.PUBLIC_URL,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      [`/${mode}`]: {
        target: buildEnv.PROXY,
        changeOrigin: true,
        rewrite: (p) => p.replace(new RegExp(`^/${mode}`), ''),
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
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      input: 'index.html',
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          react: ['react'],
          reactDom: ['react-dom'],
          reactRouterDom: ['react-router-dom'],
        },
      },
    },
  },
});
