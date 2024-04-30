import { execa } from 'execa';
import { readFileSync, writeFileSync } from 'fs';
import minimist from 'minimist';
import pc from 'picocolors';

const { gray, green } = pc;

const upgrade = async () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
  const { version } = packageJson;
  const newVersion = version
    .split('.')
    .map(Number)
    .map((v, i) => (i === 2 ? v + 1 : 0))
    .join('.');

  packageJson.version = newVersion;
  writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  // git 脚本
  await execa('git', ['add', '.'], { stdio: 'inherit' });
  await execa('git', ['commit', '-m', `chore: upgrade version to `], {
    stdio: 'inherit',
  });
  await execa('git', ['push'], { stdio: 'inherit' });
};

const build = async () => {
  try {
    const buildWorker = await execa('pnpm', ['unbuild'], { stdio: 'inherit' });
    if (buildWorker.exitCode === 0) console.log(green('build success!'));
    return buildWorker;
  } catch (error) {
    console.log(gray(error));
    return false;
  }
};

const pub = async () => {
  try {
    const buildWorker = await build();
    if (buildWorker.exitCode === 0) {
      await upgrade();
      const pubWorker = await execa('pnpm', ['publish', '--no-git-checks'], { stdio: 'inherit' });
      return !pubWorker.failed;
    }
  } catch (error) {
    console.log(gray(error));
  }
};

const executor = () => {
  const args = minimist(process.argv.slice(2));
  const { action } = args;
  if (action === 'build') build();
  else if (action === 'pub') pub();
};

executor();
