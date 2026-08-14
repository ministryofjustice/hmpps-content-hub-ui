import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as lazyLoading from './components/lazyLoading'
import initFeedbackWidget from './components/feedbackWidget'
import { initActivityTracker } from './components/activityTracker'
import { initPageNavigation } from './components/pageNavigation'

govukFrontend.initAll()
mojFrontend.initAll()
lazyLoading.initAll()
initFeedbackWidget()
initActivityTracker()
initPageNavigation()
