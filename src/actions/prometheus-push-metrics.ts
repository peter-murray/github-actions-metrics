import * as core from '@actions/core';
import { inspect } from 'util';
import { isPostExecution, setExecutionComplete } from '../util';

async function run(): Promise<void> {
  try {
    const name = core.getInput('metric_name');
    const value = core.getInput('metric_value');

    core.saveState('metric', {name: name, value: value, timestamp: Date.now()});
  } catch(err) {
    core.debug(inspect(err))
    core.setFailed(err);
  } finally {
    setExecutionComplete();
  }
}

async function cleanup(): Promise<void> {
  try {
    core.info(`Cleanup running...`);

    core.startGroup('environment');
    core.info(JSON.stringify(process.env, null, 2));
    core.endGroup();

    core.startGroup('metrics');
    const metric = JSON.parse(core.getState('metric'));
    core.info(`${metric.name} - ${JSON.stringify(metric)}`);
    core.endGroup();
  } catch(err) {
    core.debug(inspect(err))
    core.warning(err);
  }
}

if (!isPostExecution()) {
  run()
}
else {
  cleanup()
}
