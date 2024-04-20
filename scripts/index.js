import { execa } from 'execa';
import pc from 'picocolors';
import minimist from 'minimist';

const { gray, green } = pc;

const build = async () => {
  try {
    const result = await execa('pnpm', ['unbuild'], { stdio: 'inherit' }).then(() => {
      console.log(green('build success!'));
      return true;
    });
    return result;
  } catch (error) {
    console.log(gray(error));
    return false;
  }
};

const pub = async () => {
  try {
    const result = await build();
    if (result) execa('pnpm', ['publish', '--no-git-checks'], { stdio: 'inherit' });
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
