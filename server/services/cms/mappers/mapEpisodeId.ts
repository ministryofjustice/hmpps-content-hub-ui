const mapEpisodeId = (season: number | undefined, episode: number | undefined): number | null => {
  if (season !== undefined && episode !== undefined) return season * 1000 + episode
  return episode ?? null
}

export default mapEpisodeId
