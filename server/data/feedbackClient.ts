import knex, { Knex } from 'knex'
import logger from '../../logger'
import type { FeedbackRecord } from '../@types/feedbackTypes'
import config from '../config'

export interface FeedbackDatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export default class FeedbackClient {
  private connection: Knex

  constructor(dbConfig: FeedbackDatabaseConfig = config.feedback.connection) {
    const isRemote = dbConfig.host !== 'localhost' && dbConfig.host !== '127.0.0.1'
    const sslConfig = isRemote ? { rejectUnauthorized: false } : false

    this.connection = knex({
      client: 'pg',
      connection: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        ssl: sslConfig,
      },
    })
  }

  async sendFeedback(record: FeedbackRecord): Promise<void> {
    const [searchResult, databaseResult] = await Promise.allSettled([
      this.postToSearch(record),
      this.insertToDatabase(record),
    ])

    if (searchResult.status === 'rejected') {
      logger.error('Feedback search index write failed for %s', record.feedbackId, searchResult.reason)
    }

    if (databaseResult.status === 'rejected') {
      logger.error('Feedback database write failed for %s', record.feedbackId, databaseResult.reason)
    }
  }

  private async insertToDatabase(record: FeedbackRecord): Promise<void> {
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
