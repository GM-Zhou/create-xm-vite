import { apm, start } from '@xmly/xmrep'; // 集成 apm、魔镜

import packageJson from '../../package.json';

/**
 *  初始化
 */
export const monitor = () => {
  // 启动魔镜
  start({ b: 'xxx', c: {} });
  // 集成 apm 系统
  apm.init({ name: packageJson.name });
};
