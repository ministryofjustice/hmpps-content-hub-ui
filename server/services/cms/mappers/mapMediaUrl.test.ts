import mapMediaUrl from './mapMediaUrl'

describe('map media url', () => {
  const relationships = {
    field_video: { data: { type: 'file--file', id: 'file' } },
    field_audio: { data: { type: 'file--file', id: 'no-file' } },
  }

  const included = [
    {
      type: 'file--file',
      id: 'file',
      attributes: { uri: { url: 'included-url' } },
    },
  ]

  it('maps a media url from a given relationship when present', () => {
    expect(mapMediaUrl(relationships, included, 'field_video')).toEqual('included-url')
  })

  it('returns null when a relationship cannot be identified', () => {
    expect(mapMediaUrl(relationships, included, 'not_field_video')).toBeNull()
  })

  it('returns null when no included section is provided', () => {
    expect(mapMediaUrl(relationships, null, 'field_video')).toBeNull()
  })

  it('returns null when no file matches the relationship id', () => {
    expect(mapMediaUrl(relationships, included, 'field_audio')).toBeNull()
  })
})
