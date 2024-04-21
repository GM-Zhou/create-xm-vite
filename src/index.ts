#!/usr/bin/env node
import { cpSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { execa } from 'execa';
import pc from 'picocolors';
import prompts from 'prompts';

/**
 * 解析命令行，确定项目名称和模板类型
 * copy 模板文件到项目目录
 * 修改 package.json 中，name 等参数
 */

const { blue, green, yellow } = pc;

const templates = [
  {
    name: 'vue-ts-h5',
    color: green,
  },
  {
    name: 'react-ts-h5',
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
        initial: `project-${Date.now()}`,
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
      {
        type: 'confirm',
        name: 'download',
        message: 'Do you want to download dependencies?',
        initial: true,
      },
    ]);
    const pathDir = dirname(fileURLToPath(import.meta.url));
    const targetDir = `${cwd}/${result.project}`;
    const templateDir = join(pathDir, `../src/templates/${result.template}`);
    const commonDir = join(pathDir, '../src/common');

    copy(templateDir, targetDir);
    copy(commonDir, `${targetDir}/src`);
    // 修改 package.json
    const packageJsonPath = `${targetDir}/package.json`;
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    Object.assign(packageJson, {
      name: result.project,
      version: '1.0.0',
      description: '',
      author: '',
      private: true,
    });

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // 成功提示
    console.log(green(`Project ${result.project} created successfully!`));
    // 开始下载依赖
    if (result.download) {
      console.log(yellow('Installing dependencies...'));
      execa('pnpm', ['install'], { cwd: targetDir, stdio: 'inherit' }).then(() => {
        console.log(green('Dependencies installed successfully!'));
      });
    }
  } catch (error) {
    // console.log(error);
  }
};

createProject();
