import { readdirSync, stat } from 'fs';
import { blue, green } from 'kolorist';

/**
 * 解析命令行，确定项目名称和模板类型
 * copy 模板文件到项目目录
 * 修改 package.json 中，name 等参数
 */

const templates = [
  {
    name: 'vue-ts',
    color: green,
  },
  {
    name: 'react-ts',
    color: blue,
  },
];

const terminalPath = process.env.PWD;
const args = process.argv;
console.log('terminalPath', terminalPath);
console.log(args);
