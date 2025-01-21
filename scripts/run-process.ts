import { exec } from 'child_process';

export const runProcess = (cli: string, key: string) => {
  const child = exec(cli);

  const log = (key: string, data: string) => {
    data
      .trim()
      .split(/\n/)
      .forEach((line: string) => {
        console.log(`${key.padEnd(8)}: ${line}`);
      });
  };

  child.stdout.on('data', (data) => {
    log(key, data);
  });

  child.stderr.on('data', (data) => {
    log(key, data);
  });

  child.on('close', (code) => {
    log(key, `process exited with code ${code}`);
  });
};
