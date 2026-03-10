/**
 * The sentiment a user can express about a piece of content.
 */
export type FeedbackSentiment = 'LIKE' | 'DISLIKE'

/**
 * Content types that support feedback, lowercase to match i18n keys.
 */
export type FeedbackContentType = 'article' | 'video' | 'audio' | 'game' | 'series' | 'topic' | 'category'

/**
 * The request body sent from the client when submitting feedback.
 */
export interface FeedbackPayload {
  title: string
  url: string
  contentType: FeedbackContentType
  series?: string
  categories?: string
  topics?: string
  sentiment: FeedbackSentiment
  comment?: string
}

/**
 * A feedback record enriched with server-side metadata before storage.
 */
export interface FeedbackRecord extends FeedbackPayload {
  feedbackId: string
  date: string
  establishment?: string
  sessionId?: string
}

/**
 * Props passed to the Nunjucks feedback widget template.
 */
export interface FeedbackWidgetParams {
  feedbackId: string
  title: string
  contentType: FeedbackContentType
  series?: string
  categories?: string
  topics?: string
  heading?: string
}
