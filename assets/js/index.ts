import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as lazyLoading from './components/lazyLoading'
import initFeedbackWidget from './components/feedbackWidget'
import initAudioPlayer from './components/audioPlayer'
import initVideoPlayer from './components/videoPlayer'
import { initActivityTracker } from './components/activityTracker'
import { initPageNavigation } from './components/pageNavigation'

govukFrontend.initAll()
mojFrontend.initAll()
lazyLoading.initAll()
initFeedbackWidget()
initAudioPlayer()
initVideoPlayer()
initActivityTracker()
initPageNavigation()
