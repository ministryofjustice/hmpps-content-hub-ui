// A TimeSpan allows you to give meaning to a number and then read that number back in different formats
// ie.
// seconds(60).minutes === 1
// seconds(30).seconds === 30
// minutes(1).seconds === 60
// milliseconds(1000).seconds === 1
// This allows a caller to just accept a TimeSpan and then work in the units it cares about

export type TimeSpan = {
  minutes: number
  seconds: number
  milliseconds: number
}

export const minutes = (numMinutes: number): TimeSpan => {
  return {
    minutes: numMinutes,
    seconds: numMinutes * 60,
    milliseconds: seconds(numMinutes * 60).milliseconds,
  }
}

export const seconds = (numSeconds: number): TimeSpan => {
  return {
    minutes: numSeconds / 60,
    seconds: numSeconds,
    milliseconds: numSeconds * 1000,
  }
}

export const milliseconds = (numMilliseconds: number): TimeSpan => {
  return {
    minutes: seconds(numMilliseconds / 1000).minutes,
    seconds: numMilliseconds / 1000,
    milliseconds: numMilliseconds,
  }
}

// Get a time span in the past
export const timeAgo = (ago: TimeSpan) => milliseconds(Date.now() - ago.milliseconds)

// Get a time span in the future
export const timeFromNow = (fromNow: TimeSpan) => milliseconds(Date.now() + fromNow.milliseconds)
