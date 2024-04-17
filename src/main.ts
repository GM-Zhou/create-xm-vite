import { readdirSync, stat } from 'fs';
import { blue, green } from 'kolorist';
import path from 'path';
import prompts from 'prompts';

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

const createProject = async () => {
  try {
    const result = await prompts([
      {
        type: 'text',
        name: 'project',
        message: 'Project name:',
        initial: 'xm-vite-project',
      },
      {
        type: 'select',
        name: 'template',
        message: 'Select a template:',
        choices: templates.map((template) => ({
          title: template.color(template.name),
          value: template.name,
        })),
      },
    ]);
    console.log('result', result);
    const targetDir = `${terminalPath}/${result.project}`;
    const templateDir = path.resolve(__dirname, `templates/${result.template}`);
    console.log('targetDir', targetDir);
    console.log('templateDir', templateDir);
  } catch (error) {
    console.log(error);
  }
};

createProject();
