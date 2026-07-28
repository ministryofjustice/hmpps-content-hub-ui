import mapSeriesInfo from './mapSeriesInfo'

describe('map series info', () => {
  const relationships = {
    field_moj_series: { data: { type: 'file--file', id: 'moj-series' } },
  }

  const included = [
    {
      type: 'file--file',
      id: 'moj-series',
      attributes: {
        drupal_internal__tid: 1,
        name: 'series-name',
        path: { alias: 'series-path' },
      },
    },
  ]

  const successfulResult = { id: 1, name: 'series-name', path: 'series-path' }

  const failedResult: { id: number | null; name: string | null; path: string | null } = {
    id: null,
    name: null,
    path: null,
  }

  it('maps series info', () => {
    expect(mapSeriesInfo(relationships, included)).toEqual(successfulResult)
  })

  it('returns null when a relationship cannot be identified', () => {
    expect(mapSeriesInfo({}, included)).toEqual(failedResult)
  })

  it('returns null an included series cannot be identified', () => {
    expect(mapSeriesInfo(relationships, [])).toEqual(failedResult)
  })

  it('returns null when no file matches the relationship id', () => {
    const includedWithIncorrectAttributes = [
      {
        type: 'file--file',
        id: 'moj-series',
        attributes: {
          somethingElse: 'nonsense',
        },
      },
    ]
    expect(mapSeriesInfo(relationships, includedWithIncorrectAttributes)).toEqual(failedResult)
  })
})
