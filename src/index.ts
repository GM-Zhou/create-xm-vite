#!/usr/bin/env node
import { statSync, cpSync } from 'fs';
import { blue, green, yellow } from 'kolorist';
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

const cwd = process.cwd();

const copy = (src: string, dest: string) => {
  const state = statSync(src);
  cpSync(src, dest, { recursive: state.isDirectory() });
};

const createProject = async () => {
  try {
    const result = await prompts([
      {
        type: 'text',
        name: 'project',
        message: yellow('Project name:'),
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
    const targetDir = `${cwd}/${result.project}`;
    const templateDir = path.resolve(__dirname, `../src/templates/${result.template}`);

    copy(templateDir, targetDir);
  } catch (error) {
    // console.log(error);
  }
};

createProject();
