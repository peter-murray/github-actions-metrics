import * as core from '@actions/core';
import { inspect } from 'util';
import {IS_POST} from '../util';

async function run(): Promise<void> {
  try {
    core.info(`Executing...`);
  } catch(err) {
    core.debug(inspect(err))
    core.setFailed(err);
  }
}

async function cleanup(): Promise<void> {
  try {
    core.info(`Cleanup running...`);
  } catch(err) {
    core.debug(inspect(err))
    core.warning(err);
  }
}

if (!IS_POST) {
  run()
}
else {
  cleanup()
}
