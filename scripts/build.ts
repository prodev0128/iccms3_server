import fs from 'fs-extra';
import { runProcess } from './run-process';

const config = JSON.parse(fs.readFileSync('./nest-cli.json', 'utf8'));
const projects = config.projects;

Object.keys(projects).forEach((key) => {
  if (projects[key].type !== 'application') {
    return;
  }
  runProcess(`nest build ${key}`, key);
});
