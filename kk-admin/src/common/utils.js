export const randomA2B = (a, b, int) => {
  const result = Math.random() * (b - a) + a
  return int ? Math.floor(result) : result
}

export const randomA2B2 = (a, b, int) => {
  const result = Math.random() * (b - a) + a
  return int ? Math.floor(result) : result
}

export const space2Array = data => {
  let oparray = []
  let res = data
  res = res.replace(/^\n*/, '')
  res = res.replace(/\n{2,}/g, '\n')
  res = res.replace(/\n*$/, '')
  oparray = res.split('\n')
  return oparray
}

export const isUrl = url => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
  return reg.test(url)
}
