import { test } from '@playwright/test'
import { loginWithHmppsAuth, resetStubs } from '../../testUtils'
import cmsApi from '../../mockApis/cmsApi'
import HomePage from '../../pages/homePage'

test.describe('Staff homepage UI', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('renders all key homepage components', async ({ page }) => {
    await Promise.all([
      cmsApi.stubPrimaryNavigation(),
      cmsApi.stubTopics(),
      cmsApi.stubUrgentBanner(),
      cmsApi.stubHomepageContent(),
      cmsApi.stubHomepageCollectionQueries(),
      cmsApi.stubRecentlyAddedHomepageContent(),
      cmsApi.stubExploreHomepageContent(),
    ])

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
})
