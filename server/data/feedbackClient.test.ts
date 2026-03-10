import FeedbackClient from './feedbackClient'
import type { FeedbackRecord } from '../@types/feedbackTypes'

const mockInsert = jest.fn().mockResolvedValue(undefined)
const mockTable = jest.fn().mockReturnValue({ insert: mockInsert })

jest.mock('knex', () => {
  return jest.fn().mockImplementation(() => {
    const knexInstance = (table: string) => mockTable(table)
    knexInstance.destroy = jest.fn().mockResolvedValue(undefined)
    return knexInstance
  })
})

jest.mock('../../logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}))

jest.mock('../config', () => ({
  production: false,
  feedback: {
    searchEndpoint: 'http://localhost:9200/feedback',
    database: {
      host: 'localhost',
      port: 5432,
      user: 'testuser',
      password: 'testpass',
      database: 'testdb',
    },
  },
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('FeedbackClient', () => {
  let client: FeedbackClient
  const logger = require('../../logger')

  const record: FeedbackRecord = {
    feedbackId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Test Article',
    url: '/content/test-article',
    contentType: 'article',
    series: 'Test Series',
    categories: 'Education',
    topics: 'Maths',
    sentiment: 'LIKE',
    comment: 'Great content',
    date: '2026-03-09T10:00:00.000Z',
    establishment: 'HMP BERWYN',
    sessionId: 'session-123',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true, status: 200, statusText: 'OK' })
    client = new FeedbackClient()
  })

  describe('database insert', () => {
    it('inserts a full feedback record into the feedback table', async () => {
      await client.sendFeedback(record)

      expect(mockTable).toHaveBeenCalledWith('feedback')
      expect(mockInsert).toHaveBeenCalledWith({
        title: 'Test Article',
        url: '/content/test-article',
        contentType: 'article',
        series: 'Test Series',
        categories: 'Education',
        topics: 'Maths',
        sentiment: 'LIKE',
        comment: 'Great content',
        date: '2026-03-09T10:00:00.000Z',
        establishment: 'HMP BERWYN',
        sessionId: 'session-123',
        feedbackId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      })
    })

    it('defaults optional fields to empty strings when undefined', async () => {
      const minimal: FeedbackRecord = {
        feedbackId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        title: 'Minimal',
        url: '/content/minimal',
        contentType: 'video',
        sentiment: 'DISLIKE',
        date: '2026-03-09T10:00:00.000Z',
      }

      await client.sendFeedback(minimal)

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          series: '',
          categories: '',
          topics: '',
          comment: '',
          establishment: '',
          sessionId: '',
        }),
      )
    })

    it('logs an error but does not throw when insert fails', async () => {
      mockInsert.mockRejectedValueOnce(new Error('connection refused'))

      await expect(client.sendFeedback(record)).resolves.toBeUndefined()
      expect(logger.error).toHaveBeenCalledWith('Feedback database write failed', expect.any(Error))
    })
  })

  describe('search index', () => {
    it('posts feedback to the search index', async () => {
      await client.sendFeedback(record)

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:9200/feedback/${record.feedbackId}`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        }),
      )

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body).toEqual({
        title: 'Test Article',
        url: '/content/test-article',
        contentType: 'article',
        series: 'Test Series',
        sentiment: 'LIKE',
        comment: 'Great content',
        date: '2026-03-09T10:00:00.000Z',
        establishment: 'HMP BERWYN',
        sessionId: 'session-123',
      })
    })

    it('omits series from search payload when not present', async () => {
      await client.sendFeedback({ ...record, series: undefined })

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.series).toBeUndefined()
    })

    it('omits comment from search payload when not present', async () => {
      await client.sendFeedback({ ...record, comment: undefined })

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.comment).toBeUndefined()
    })

    it('logs an error but does not throw when search POST fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' })

      await expect(client.sendFeedback(record)).resolves.toBeUndefined()
      expect(logger.error).toHaveBeenCalledWith('Feedback search index write failed', expect.any(Error))
    })
  })

  it('handles both search and database failures gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 503, statusText: 'Service Unavailable' })
    mockInsert.mockRejectedValueOnce(new Error('db error'))

    await expect(client.sendFeedback(record)).resolves.toBeUndefined()
    expect(logger.error).toHaveBeenCalledTimes(2)
  })
})
