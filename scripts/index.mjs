import { execa } from 'execa';
import pc from 'picocolors';
import minimist from 'minimist';

const { gray, green } = pc;

const build = async () => {
  try {
    const result = await execa('pnpm', ['unbuild'], { stdio: 'inherit' }).then(() => {
      console.log(green('Unbuild success!'));
      return true;
    });
    return result;
  } catch (error) {
    console.log(gray(error));
    return false;
  }
};

const publish = async () => {
  try {
    const result = await build();
    if (result) execa('pnpm', ['publish'], { stdio: 'inherit' });
  } catch (error) {
    console.log(gray(error));
  }
};

const executor = () => {
  const args = minimist(process.argv.slice(2));
  const { action } = args;
  if (action === 'build') build();
  else if (action === 'publish') publish();
};

executor();
