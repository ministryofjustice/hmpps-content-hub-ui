import FeedbackService from './feedbackService'
import type { FeedbackRecord } from '../@types/feedbackTypes'
import type FeedbackClient from '../data/feedbackClient'
import logger from '../../logger'

jest.mock('../../logger', () => ({
  info: jest.fn(),
}))

const mockedLogger = logger as jest.Mocked<typeof logger>

describe('FeedbackService', () => {
  let service: FeedbackService
  let mockClient: jest.Mocked<FeedbackClient>

  beforeEach(() => {
    jest.resetAllMocks()
    mockClient = {
      sendFeedback: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<FeedbackClient>
    service = new FeedbackService(mockClient)
  })

  const record: FeedbackRecord = {
    feedbackId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Test Article',
    url: '/content/test-article',
    contentType: 'article',
    sentiment: 'LIKE',
    comment: 'I enjoyed this',
    date: '2026-03-09T10:00:00.000Z',
    establishment: 'HMP BERWYN',
    sessionId: 'session-123',
  }

  it('logs the feedback record at info level', async () => {
    await service.sendFeedback(record)

    expect(mockedLogger.info).toHaveBeenCalledWith('Feedback received: %s', record.feedbackId)
  })

  it('delegates to the feedback client', async () => {
    await service.sendFeedback(record)

    expect(mockClient.sendFeedback).toHaveBeenCalledWith(record)
  })

  it('does not throw when called with a minimal record', async () => {
    const minimal: FeedbackRecord = {
      feedbackId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      title: 'Minimal',
      url: '/content/minimal',
      contentType: 'video',
      sentiment: 'DISLIKE',
      date: '2026-03-09T10:00:00.000Z',
    }

    await expect(service.sendFeedback(minimal)).resolves.toBeUndefined()
  })
})
