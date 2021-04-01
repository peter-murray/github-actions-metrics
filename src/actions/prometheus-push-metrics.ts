import * as core from '@actions/core';
import { inspect } from 'util';
import {isPostExecution, setExecutionComplete} from '../util';

async function run(): Promise<void> {
  try {
    const name = core.getInput('metric_name');
    const value = core.getInput('metric_value');

    const metricStateName = `metrics_value_${name}`;
    core.saveState(metricStateName, {value: value, timestamp: Date.now()});

    const existingNames: string = core.getState('metrics_names');
    let parsedNames: string[];
    if (existingNames) {
      parsedNames = JSON.parse(existingNames);
    } else {
      parsedNames = [metricStateName];
    }
    core.saveState('metrics_names', parsedNames);

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

    const savedMetricsNames = core.getState('metrics_names');
    core.startGroup('metrics');
    core.info(savedMetricsNames);

    if (savedMetricsNames) {
      const metricNames: string[] = JSON.parse(savedMetricsNames);

      metricNames.forEach(name => {
        core.info(`${name} - ${core.getState(name)}`);
      });
    }

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
