import { expect, test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs, stubHomePageQueries, stubTopicPage } from '../../testUtils'
import HomePage from '../../pages/homePage'
import cmsApi from '../../mockApis/cmsApi'
import { defaultTopicsResponse } from '../../fixtures/cmsTopics'

const allTopicsResponse = defaultTopicsResponse

const expectedTopics = allTopicsResponse.data.map(topic => topic.attributes.name)

const stubStaffHomepageCms = async ({ includeTagPageStubs = false }: { includeTagPageStubs?: boolean } = {}) => {
  const requests = [
    cmsApi.stubPrimaryNavigation(),
    cmsApi.stubTopics(200, allTopicsResponse),
    cmsApi.stubUrgentBanner(),
    cmsApi.stubHomepageContent(),
    cmsApi.stubHomepageCollectionQueries(),
    cmsApi.stubRecentlyAddedHomepageContent(),
    cmsApi.stubExploreHomepageContent(),
  ]

  if (includeTagPageStubs) {
    for (const topic of allTopicsResponse.data) {
      requests.push(...stubTopicPage(topic))
    }
  }

  await Promise.all(requests)
}

test.describe('Staff homepage UI', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async () => {
    await resetStubs()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('renders all key homepage components', async ({ page }) => {
    await stubHomePageQueries()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)

    await homePage.verifyPrimaryNavigationLabels([
      'My prison',
      'Sentence journey',
      'News and events',
      'Learning and skills',
      'Inspire and entertain',
      'Health and wellbeing',
      'Faith',
    ])

    await homePage.verifyMainSectionsVisible()
    await homePage.verifyHomepageCardCounts()
  })

  test('Browse all topics CTA takes user to the topics page', async ({ page }) => {
    await stubStaffHomepageCms()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)
    await homePage.browseAllTopicsButton.click()

    await expect(page).toHaveURL('/topics')
    await expect(page.getByRole('heading', { name: 'Browse all topics', level: 1 })).toBeVisible()
    for (const topic of expectedTopics) {
      await expect(page.locator('#main-content').getByRole('link', { name: topic, exact: true })).toBeVisible()
    }
  })

  test('Browse all topics page contains valid links for all topics', async ({ page }) => {
    await stubStaffHomepageCms()

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)
    await homePage.browseAllTopicsButton.click()

    const topicLinks = page.locator('#main-content .govuk-grid-row .govuk-list .govuk-link')
    await expect(topicLinks).toHaveCount(expectedTopics.length)

    for (const topic of expectedTopics) {
      await expect(page.locator('#main-content').getByRole('link', { name: topic, exact: true })).toHaveAttribute(
        'href',
        /\/tags\/\d+$/,
      )
    }
  })

  test('Browse all topics page launches each topic link', async ({ page }) => {
    await stubStaffHomepageCms({ includeTagPageStubs: true })

    await loginWithHmppsAuth(page, { name: 'A TestUser' })

    const homePage = await HomePage.verifyOnPage(page)
    await homePage.browseAllTopicsButton.click()

    for (let index = 0; index < expectedTopics.length; index += 1) {
      const topic = expectedTopics[index]
      const topicLink = page.locator('#main-content').getByRole('link', { name: topic, exact: true })

      await topicLink.click()
      await expect(page).toHaveURL(new RegExp(`^http://staff\\.localhost:3007/tags/${index + 1}$`))
      await expect(page.locator('#main-content').getByRole('heading', { name: topic, level: 1 })).toBeVisible()
      await page.goto('/topics')
      await expect(page).toHaveURL('/topics')
    }
  })
})
