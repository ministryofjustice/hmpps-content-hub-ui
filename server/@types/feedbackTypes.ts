export type FeedbackSentiment = 'LIKE' | 'DISLIKE'

export type FeedbackContentType = 'article' | 'video' | 'audio' | 'game' | 'series' | 'topic' | 'category'

export interface FeedbackPayload {
  title: string
  url: string
  contentType: FeedbackContentType | ''
  series?: string
  categories?: string
  topics?: string
  sentiment: FeedbackSentiment
  comment?: string
}

export interface FeedbackRecord extends FeedbackPayload {
  feedbackId: string
  date: string
  establishment?: string
  sessionId?: string
}
