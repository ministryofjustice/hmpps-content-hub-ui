import { Router, Request, Response, NextFunction } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import config from '../config'

type TopicGroup = {
  letter: string
  topics: Array<{ id: string; linkText: string; href: string }>
}

type TopicColumn = {
  groups: TopicGroup[]
}

export default function topicsRoutes({ auditServiceSource, cmsService }: Services): Router {
  const router = Router()

  router.get('/topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.TOPICS, {
        who: res.locals.user?.username,
        correlationId: req.id,
      })

      const establishmentName = res.locals.establishment?.name || config.establishments[0].name
      const language = res.locals.language || 'en'

      const topics = await cmsService.getTopics(establishmentName, language)

      const groupedTopics = topics.reduce<TopicGroup[]>((groups, topic) => {
        const letter = topic.linkText.trim().charAt(0).toUpperCase()
        const group = groups.find(item => item.letter === letter) || { letter, topics: [] }
        if (!groups.includes(group)) groups.push(group)
        group.topics.push(topic)
        return groups
      }, [])

      const columnSize = Math.ceil(groupedTopics.length / 3)
      const groupedColumns: TopicColumn[] = Array.from({ length: 3 }, (_, i) => ({
        groups: groupedTopics.slice(i * columnSize, (i + 1) * columnSize),
      }))

      res.render('pages/topics', { groupedColumns })
    } catch (error) {
      next(error)
    }
  })

  router.get('/tags/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.TAG, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: req.params.id,
      })

      throw new Error('Tag route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  router.get('/tags/:id/json', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await auditServiceSource.get(req.portalType).logPageView(Page.TAG_JSON, {
        who: res.locals.user?.username,
        correlationId: req.id,
        subjectId: req.params.id,
      })

      throw new Error('Tag JSON route is functional - pending implementation')
    } catch (error) {
      next(error)
    }
  })

  return router
}
