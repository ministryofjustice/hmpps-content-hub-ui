import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import FeedbackService from '../services/feedbackService'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')
jest.mock('../services/feedbackService')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const feedbackService = new FeedbackService(null as never) as jest.Mocked<FeedbackService>
let app: Express

const validUUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

const validBody = {
  title: 'Test Article',
  url: '/content/test-article',
  contentType: 'article',
  sentiment: 'LIKE',
}

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)
  feedbackService.sendFeedback.mockResolvedValue(undefined)

  app = appWithAllRoutes({
    services: {
      auditServiceSource,
      feedbackService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Feedback Routes', () => {
  describe('POST /feedback/:feedbackId', () => {
    it('returns 400 when feedbackId is not a valid UUID', () => {
      return request(app).post('/feedback/not-a-uuid').send(validBody).expect(400)
    })

    it('returns 400 when body is missing required fields', () => {
      return request(app).post(`/feedback/${validUUID}`).send({}).expect(400)
    })

    it('returns 400 when sentiment is invalid', () => {
      return request(app)
        .post(`/feedback/${validUUID}`)
        .send({ ...validBody, sentiment: 'INVALID' })
        .expect(400)
    })

    it('returns 400 when contentType is invalid', () => {
      return request(app)
        .post(`/feedback/${validUUID}`)
        .send({ ...validBody, contentType: 'invalid' })
        .expect(400)
    })

    it('returns 200 and processes valid feedback', () => {
      return request(app)
        .post(`/feedback/${validUUID}`)
        .send(validBody)
        .expect(200)
        .expect(() => {
          expect(auditService.logPageView).toHaveBeenCalled()
          expect(feedbackService.sendFeedback).toHaveBeenCalled()
        })
    })

    it('returns 200 with only required fields', () => {
      return request(app)
        .post(`/feedback/${validUUID}`)
        .send({
          title: 'Minimal',
          url: '/content/minimal',
          contentType: 'video',
          sentiment: 'DISLIKE',
        })
        .expect(200)
    })

    it('calls auditServiceSource with correct parameters', () => {
      return request(app)
        .post(`/feedback/${validUUID}`)
        .send(validBody)
        .expect(200)
        .expect(() => {
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.FEEDBACK, {
            who: user.username,
            correlationId: expect.any(String),
            subjectId: validUUID,
          })
        })
    })

    it('sends feedback with enriched record', () => {
      return request(app)
        .post(`/feedback/${validUUID}`)
        .send({ ...validBody, series: 'Test Series', categories: 'Cat1', topics: 'Topic1', comment: 'Great' })
        .expect(200)
        .expect(() => {
          expect(feedbackService.sendFeedback).toHaveBeenCalledWith(
            expect.objectContaining({
              feedbackId: validUUID,
              title: 'Test Article',
              url: '/content/test-article',
              contentType: 'article',
              sentiment: 'LIKE',
              series: 'Test Series',
              categories: 'Cat1',
              topics: 'Topic1',
              comment: 'Great',
              date: expect.any(String),
            }),
          )
        })
    })
  })
})
