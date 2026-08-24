import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries, stubTopicPage } from '../../testUtils'
import HomePage from '../../pages/homePage'
import TopicsPage from '../../pages/topicsPage'
import TagPage from '../../pages/tagPage'
import cmsApi from '../../mockApis/cmsApi'

const navigationTopic = {
  id: 'topic-103',
  attributes: {
    drupal_internal__tid: 103,
    name: 'Learning and skills',
  },
}

const stubMyPrisonTopicJourney = async () => {
  await stubHomePageQueries()
  await cmsApi.stubTopics(200, { data: [navigationTopic] })
  await Promise.all(stubTopicPage(navigationTopic))
}

test.describe('Staff My Prison navigation and breadcrumbs', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Topic page marks the matching primary navigation item active and renders the breadcrumb trail', async ({
    page,
  }) => {
    await stubMyPrisonTopicJourney()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await page.goto('/tags/103')

    await expect(page).toHaveURL('/tags/103')
    const tagPage = await TagPage.verifyOnPage(page, navigationTopic.attributes.name)

    await tagPage.verifyActivePrimaryNavigation('Learning and skills', '/tags/103')
    await tagPage.verifyBreadcrumbLink('Home', '/')
    await tagPage.verifyBreadcrumbLink('Topics', '/topics')
    await tagPage.verifyBreadcrumbContains(navigationTopic.attributes.name)
  })

  test('Topic page breadcrumb Topics link navigates to the topics page', async ({ page }) => {
    await stubMyPrisonTopicJourney()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })
    await page.goto('/tags/103')

    const tagPage = await TagPage.verifyOnPage(page, navigationTopic.attributes.name)
    await tagPage.clickBreadcrumb('Topics')

    await expect(page).toHaveURL('/topics')
    await TopicsPage.verifyOnPage(page)
  })

  test('Topic page breadcrumb Home link navigates to the homepage', async ({ page }) => {
    await stubMyPrisonTopicJourney()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })
    await page.goto('/tags/103')

    const tagPage = await TagPage.verifyOnPage(page, navigationTopic.attributes.name)
    await tagPage.clickBreadcrumb('Home')

    await expect(page).toHaveURL('/')
    await HomePage.verifyOnPage(page)
  })

  test('Topic page back and forward navigation links move through browser history', async ({ page }) => {
    await stubMyPrisonTopicJourney()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    await page.goto('/topics')
    await expect(page).toHaveURL('/topics')
    await TopicsPage.verifyOnPage(page)

    await page.goto('/tags/103')
    await expect(page).toHaveURL('/tags/103')
    const tagPage = await TagPage.verifyOnPage(page, navigationTopic.attributes.name)

    await tagPage.clickBackNavigation()
    await expect(page).toHaveURL('/topics')
    await TopicsPage.verifyOnPage(page)

    await tagPage.clickForwardNavigation()
    await expect(page).toHaveURL('/tags/103')
    await TagPage.verifyOnPage(page, navigationTopic.attributes.name)
  })
})
