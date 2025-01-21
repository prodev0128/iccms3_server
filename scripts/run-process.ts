import { exec } from 'child_process';

export const runProcess = (cli: string, key: string) => {
  const child = exec(cli);

  child.stdout.on('data', (data) => {
    console.log(`${key}: ${data.trim()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`${key}: ${data.trim()}`);
  });

  child.on('close', (code) => {
    console.log(`${key}: process exited with code ${code}`);
  });
};
