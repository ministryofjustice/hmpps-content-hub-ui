import knex, { Knex } from 'knex'
import logger from '../../logger'
import type { FeedbackRecord } from '../@types/feedbackTypes'
import config from '../config'

export interface FeedbackDatabaseConfig {
  host: string | unknown
  port: number
  user: string | unknown
  password: string | unknown
  database: string | unknown
}

export default class FeedbackClient {
  private connection: Knex

  constructor(dbConfig: FeedbackDatabaseConfig = config.feedback.connection) {
    const isRemote = dbConfig.host !== 'localhost' && dbConfig.host !== '127.0.0.1'
    const sslConfig = isRemote ? { rejectUnauthorized: false } : false

    this.connection = knex({
      client: config.feedback.client,
      connection: {
        host: dbConfig.host as string,
        port: dbConfig.port,
        user: dbConfig.user as string,
        password: dbConfig.password as string,
        database: dbConfig.database as string,
        ssl: sslConfig,
      },
    })

    logger.debug('Feedback database connection established')
  }

  async sendFeedback(record: FeedbackRecord): Promise<void> {
    logger.info('FeedbackClient.sendFeedback called for %s', record.feedbackId)

    const [searchResult, databaseResult] = await Promise.allSettled([
      this.postToSearch(record),
      this.insertToDatabase(record),
    ])

    if (searchResult.status === 'rejected') {
      logger.error('Feedback search index write failed', searchResult.reason)
    } else {
      logger.info('Feedback search index write succeeded for %s', record.feedbackId)
    }

    if (databaseResult.status === 'rejected') {
      logger.error('Feedback database write failed', databaseResult.reason)
    } else {
      logger.info('Feedback database write succeeded for %s', record.feedbackId)
    }
  }

  private async insertToDatabase(record: FeedbackRecord): Promise<void> {
    logger.info(
      'Inserting feedback %s into database (host: %s, db: %s)',
      record.feedbackId,
      this.connection.client.config.connection.host,
      this.connection.client.config.connection.database,
    )
    await this.connection('feedback').insert({
      title: record.title,
      url: record.url,
      contentType: record.contentType,
      series: record.series ?? '',
      categories: record.categories ?? '',
      topics: record.topics ?? '',
      sentiment: record.sentiment,
      comment: record.comment ?? '',
      date: record.date,
      establishment: record.establishment ?? '',
      sessionId: record.sessionId ?? '',
      feedbackId: record.feedbackId,
    })
  }

  private async postToSearch(record: FeedbackRecord): Promise<void> {
    const payload: Record<string, string> = {
      title: record.title,
      url: record.url,
      contentType: record.contentType,
      sentiment: record.sentiment,
      date: record.date,
      establishment: record.establishment ?? '',
      sessionId: record.sessionId ?? '',
    }

    if (record.series) payload.series = record.series
    if (record.comment) payload.comment = record.comment

    const url = `${config.feedback.searchEndpoint}/${encodeURIComponent(record.feedbackId)}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Search index POST failed: ${response.status} ${response.statusText}`)
    }
  }

  async destroy(): Promise<void> {
    await this.connection.destroy()
  }
}
