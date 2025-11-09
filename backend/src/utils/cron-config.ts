import { CronJob } from 'cron';
import { cleanTemp } from './clean-temp';

export const cleanTempJob = CronJob.from({
	cronTime: '*/10 * * * *',
	onTick: async () => await cleanTemp(),
	start: false,
});
