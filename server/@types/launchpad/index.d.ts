export type PrisonerEvent = {
  timeString: string
  description: string
  location: string
}

export type EventsData = {
  isTomorrow: boolean
  error: boolean
  prisonerEvents: PrisonerEvent[]
}

export type TimetableEvents = {
  [key: string]: TimetableRow
}

export type CalendarEventsData = {
  error: boolean
  prisonerEvents: ScheduledEvent[]
}

export type Link = {
  image: string
  title: string
  url: string
  description: string
  openInNewTab: boolean
  hidden: boolean
}

export type Establishment = {
  code: string
  name: string
  displayName: string
  youth: boolean
}

export type TimetableOptions = {
  fromDate: Date
  toDate: Date
  language: string
}

export type TimetableSession = {
  finished: boolean
  events: TimetableEventFormatted[] // Updated to specify type
}

export type TimetableRow = {
  morning: TimetableSession
  afternoon: TimetableSession
  evening: TimetableSession
  title: string
}

export type NewTableRowOptions = {
  title: string
  hasDateElapsed: boolean
}

export type TimetableState = {
  events: TimetableEvents
  hasEvents: boolean
}

export type Scope = {
  type: string
  humanReadable: string
}

export type Client = {
  id: string
  name: string
  logoUri?: string
  description: string
  autoApprove: boolean
  createdDate: string
  scopes: Scope[]
}

export type ApprovedClients = {
  page: number
  exhausted: boolean
  totalElements: number
  content: Client[]
}
