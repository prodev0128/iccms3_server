import { exec } from 'child_process';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./nest-cli.json', 'utf8'));
const projects = config.projects;

Object.keys(projects).forEach((key) => {
  if (projects[key].type !== 'application') {
    return;
  }
  const child = exec(`nest start ${key} --watch`);

  child.stdout.on('data', (data) => {
    console.log(`${key}: ${data.trim()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`${key}: ${data.trim()}`);
  });

  child.on('close', (code) => {
    console.log(`${key}: Child process exited with code ${code}`);
  });
});
