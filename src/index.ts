#!/usr/bin/env node
import { cpSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
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

const templates = [
  {
    name: 'vue-ts-h5',
    color: pc.green,
  },
  {
    name: 'react-ts-h5',
    color: pc.blue,
  },
];

// 获取当前工作目录
const cwd = process.cwd();

// 获取当前文件所在目录
const pathDir = dirname(fileURLToPath(import.meta.url));

const logCliInfo = () => {
  const packageJsonPath = join(pathDir, '../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  console.log(pc.cyan(`xm-create-vite ${packageJson.version}`));
};

logCliInfo();

const copy = (src: string, dest: string) => {
  const state = statSync(src);
  cpSync(src, dest, { recursive: state.isDirectory() });
};

// 检查 pnpm,npm,yarn
const checkManager = async () => {
  let manager = 'npm';
  const checkPnpm = await execa('pnpm', ['--version']);
  const checkYarn = await execa('yarn', ['--version']);
  if (!checkPnpm.failed) manager = 'pnpm';
  else if (!checkYarn.failed) manager = 'yarn';
  return manager;
};

const createProject = async () => {
  try {
    const result = await prompts([
      {
        type: 'text',
        name: 'project',
        message: pc.yellow('Project name:'),
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
    // 重命名_gitignore文件
    const _gitignorePath = `${targetDir}/_gitignore`;
    renameSync(_gitignorePath, `${targetDir}/.gitignore`);

    // 成功提示
    console.log(pc.green(`Project ${result.project} created successfully!`));
    // 开始下载依赖
    if (result.download) {
      console.log(pc.yellow('Installing dependencies...'));
      const manager = await checkManager();
      console.log(pc.yellow(`Using ${manager} as package manager`));
      execa(manager, ['install'], { cwd: targetDir, stdio: 'inherit' }).then(() => {
        console.log(pc.green('Dependencies installed successfully!'));
      });
    }
  } catch (error) {
    // console.log(error);
  }
};

createProject();
