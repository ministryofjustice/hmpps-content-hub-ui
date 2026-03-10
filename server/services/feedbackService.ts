import { FeedbackRecord } from '../@types/feedbackTypes'
import logger from '../../logger'
import type FeedbackClient from '../data/feedbackClient'

export default class FeedbackService {
  constructor(private readonly feedbackClient: FeedbackClient) {}

  async sendFeedback(record: FeedbackRecord): Promise<void> {
    logger.info({ record }, `Feedback received: ${record.feedbackId}`)
    await this.feedbackClient.sendFeedback(record)
  }
}
