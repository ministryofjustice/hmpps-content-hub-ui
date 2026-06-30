import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import AuditService from '../services/auditService'
import AuditServiceSource from '../services/auditServiceSource'
import { RecordActivityBody } from './activity'

jest.mock('../services/auditService')
jest.mock('../services/auditServiceSource')

const auditServiceSource = new AuditServiceSource(null) as jest.Mocked<AuditServiceSource>
const auditService = new AuditService(null) as jest.Mocked<AuditService>
let app: Express

beforeEach(() => {
  auditServiceSource.get.mockReturnValue(auditService)
})

afterEach(() => {
  jest.resetAllMocks()
})

const goodRequestBody: RecordActivityBody = {
  videoPlayed: {
    timesPressedPlay: 1,
    totalPlayTimeInSeconds: 2,
  },
  videoPaused: {
    timesPressedPause: 3,
    totalPausedTimeInSeconds: 4,
  },
  timeAwayFromPage: {
    timesSwitchedAwayFromPage: 5,
    totalTimeAwayFromPageInSeconds: 6,
  },
  pageLoadedAt: new Date(),
  timeOnPageInSeconds: 7,
  path: '/content/123',
  contentId: '123',
  tagId: '',
  journeyId: '999',
  requestId: '888',
}

xdescribe('Activity tracking', () => {
  describe('POST /record/activity', () => {
    describe('when on the staff portal', () => {
      beforeEach(() => {
        app = appWithAllRoutes({
          services: {
            auditServiceSource,
          },
          isStaffPortal: true,
        })
      })

      it('renders 200 without logging an audit event', async () => {
        await request(app)
          .post('/record/activity')
          .send(goodRequestBody)
          .set('Content-Type', 'application/json')
          .expect(200)
        expect(auditService.logAuditEvent).not.toHaveBeenCalled()
      })
    })
  })
})
