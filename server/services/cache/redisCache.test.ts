import { createClient } from 'redis'
import { minutes } from '@ministryofjustice/hmpps-prisoner-auth'
import RedisCache from './redisCache'

const mockGetter = jest.fn()
const mockSetter = jest.fn()
const mockConnect = jest.fn()
let isOpen = true

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    get: mockGetter,
    set: mockSetter,
    connect: mockConnect,
    isOpen,
  })),
}))

describe('redisCache', () => {
  const mockClient = createClient()
  const redisCache = new RedisCache(mockClient, minutes(5))

  afterEach(() => {
    mockGetter.mockReset()
    mockSetter.mockReset()
  })

  it('returns a cached value when one is present', async () => {
    mockGetter.mockImplementation(() => {
      return '{"data": "cache-hit"}'
    })

    const result = await redisCache.cached<{ data: string }>('key', jest.fn())

    expect(mockGetter).toHaveBeenCalledWith('key')
    expect(mockSetter).not.toHaveBeenCalled()
    expect(mockConnect).not.toHaveBeenCalled()
    expect(result).toEqual({ data: 'cache-hit' })
  })

  it('calls a provided callback and sets a new cached value when an existing value cannot be found', async () => {
    mockGetter.mockImplementation(() => undefined)

    const mockCallback = jest.fn().mockImplementation(() => ({ data: 'from-callback' }))

    const result = await redisCache.cached<{ data: string }>('key', mockCallback)

    expect(mockGetter).toHaveBeenCalledWith('key')

    expect(mockCallback).toHaveBeenCalled()
    expect(mockSetter).toHaveBeenCalledWith('key', '{"data":"from-callback"}', {
      expiration: { type: 'EX', value: 300 },
    })

    expect(result).toEqual({ data: 'from-callback' })
  })

  it('default cache value can be overridden', async () => {
    mockGetter.mockImplementation(() => undefined)

    const result = await redisCache.cached<{ data: string }>(
      'key',
      jest.fn().mockImplementation(() => ({ data: 'from-callback' })),
      minutes(1),
    )

    expect(mockSetter).toHaveBeenCalledWith('key', '{"data":"from-callback"}', {
      expiration: { type: 'EX', value: 60 },
    })

    expect(result).toEqual({ data: 'from-callback' })
  })

  it('attempts to connect to redis if no connections are currently open', async () => {
    isOpen = false

    const disconnectedClient = createClient()
    const disconnectedCache = new RedisCache(disconnectedClient, minutes(5))

    await disconnectedCache.cached('key', jest.fn())

    expect(mockConnect).toHaveBeenCalled()
  })
})
