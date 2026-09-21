const getActiveAgencies = (
  establishments: Array<{ code: string; active: string[] }>,
  forEnv: string = process.env.ENVIRONMENT_NAME,
) => {
  return establishments
    .filter(establishment => establishment.active.includes(forEnv))
    .map(establishment => establishment.code)
}

export default getActiveAgencies
