import { milliseconds, minutes, seconds, timeAgo, timeFromNow, TimeSpan } from './timeSpans'

describe('time spans', () => {
  describe('minutes', () => {
    const cases = [
      [1, 1, 60, 60000],
      [5, 5, 300, 300000],
      [0.5, 0.5, 30, 30000],
      [0, 0, 0, 0],
    ]

    test.each(cases)(
      'Given %p minute(s), minutes is %p, seconds is %p and milliseconds is %p',
      (example, expectedMinutes, expectedSeconds, expectedMilliseconds) => {
        const subject = minutes(example)
        expect(subject.minutes).toEqual(expectedMinutes)
        expect(subject.seconds).toEqual(expectedSeconds)
        expect(subject.milliseconds).toEqual(expectedMilliseconds)
      },
    )
  })

  describe('seconds', () => {
    const cases = [
      [1, 0.01666667, 1, 1000],
      [60, 1, 60, 60000],
      [120, 2, 120, 120000],
    ]

    test.each(cases)(
      'Given %p seconds(s), minutes is %p, seconds is %p and milliseconds is %p',
      (example, expectedMinutes, expectedSeconds, expectedMilliseconds) => {
        const subject = seconds(example)
        expect(subject.minutes).toBeCloseTo(expectedMinutes)
        expect(subject.seconds).toEqual(expectedSeconds)
        expect(subject.milliseconds).toEqual(expectedMilliseconds)
      },
    )
  })

  describe('milliseconds', () => {
    const cases = [
      [1, 0.00001667, 0.001, 1],
      [1000, 0.01666667, 1, 1000],
    ]

    test.each(cases)(
      'Given %p milliseconds(s), minutes is %p, seconds is %p and milliseconds is %p',
      (example, expectedMinutes, expectedSeconds, expectedMilliseconds) => {
        const subject = milliseconds(example)
        expect(subject.minutes).toBeCloseTo(expectedMinutes)
        expect(subject.seconds).toEqual(expectedSeconds)
        expect(subject.milliseconds).toEqual(expectedMilliseconds)
      },
    )
  })

  describe('timeAgo', () => {
    const dateNowInMs: number = 1770000000000

    beforeEach(() => {
      Date.now = jest.fn(() => dateNowInMs)
    })

    const cases: [string, number, TimeSpan][] = [
      ['1 millisecond', dateNowInMs - 1, milliseconds(1)],
      ['1 second', dateNowInMs - 1000, seconds(1)],
      ['30 seconds', dateNowInMs - 30000, seconds(30)],
      ['2 minutes', dateNowInMs - 120000, minutes(2)],
    ]

    test.each(cases)(
      'Given a current time in milliseconds 1770000000000 and a timespan of %p, the expected past timespan in milliseconds is %p',
      (description, expectedMilliseconds, example) => {
        expect(timeAgo(example).milliseconds).toEqual(expectedMilliseconds)
      },
    )
  })

  describe('timeFromNow', () => {
    const dateNowInMs: number = 1770000000000

    beforeEach(() => {
      Date.now = jest.fn(() => dateNowInMs)
    })

    const cases: [string, number, TimeSpan][] = [
      ['1 millisecond', dateNowInMs + 1, milliseconds(1)],
      ['1 second', dateNowInMs + 1000, seconds(1)],
      ['30 seconds', dateNowInMs + 30000, seconds(30)],
      ['2 minutes', dateNowInMs + 120000, minutes(2)],
    ]

    test.each(cases)(
      'Given a current time in milliseconds 1770000000000 and a timespan of %p, the expected future timespan in milliseconds is %p',
      (description, expectedMilliseconds, example) => {
        expect(timeFromNow(example).milliseconds).toEqual(expectedMilliseconds)
      },
    )
  })
})
