import { execa } from 'execa';
import minimist from 'minimist';
import pc from 'picocolors';

const { gray, green } = pc;

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
    if (buildWorker.exitCode === 0) execa('pnpm', ['publish', '--no-git-checks'], { stdio: 'inherit' });
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
