const getActiveAgencies = (establishments: Array<{ code: string; active: boolean }>) => {
  return establishments.filter(establishment => establishment.active).map(establishment => establishment.code)
}

export default getActiveAgencies
