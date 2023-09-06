import { JobContract, JobsOptions } from '@ioc:Rocketseat/Bull'
import Tasks from './Tasks/index'
import { BullQueue } from 'Contracts/const'

export default class BaseQueue implements JobContract {
  public key = BullQueue.default

  public static Queues = BullQueue

  public static get tasks() {
    return Tasks
  }

  public options: JobsOptions = { priority: 100 }

  public async handle(job) {
    const taskName = job.data.taskName
    if (BaseQueue.tasks[taskName]) {
      const JobClass = require(`./Tasks/${taskName}`).default
      await new JobClass().handle(job)
    }
  }
}
