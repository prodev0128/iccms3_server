import { exec } from 'child_process';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./nest-cli.json', 'utf8'));
const projects = config.projects;

Object.keys(projects).forEach((key) => {
  exec(`nest build ${key}`, (err, stdout, stderr) => {
    if (err) {
      return;
    }
    if (stdout) {
      console.log(`${key}: ${stdout}`);
    }
    if (stderr) {
      console.log(`${key}: ${stderr}`);
    }
  });
});
