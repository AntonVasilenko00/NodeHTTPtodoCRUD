export const trimSymbol = (symbol: string) => (str: string) => {
  if (symbol.length !== 1) return str

  let trimmedUrl = str
  if (trimmedUrl[trimmedUrl.length - 1] === '/') trimmedUrl = trimmedUrl.slice(0, -1)
  if (trimmedUrl[0] === '/') trimmedUrl = trimmedUrl.substring(1)
  return trimmedUrl
}
export const trimSlash = trimSymbol('/')

export const isPathWithId = (path: string) => path.split('/').length === 2

export const getIdFromUrl = (url: string) => {
  const urlArr = url.split('/')
  return urlArr[urlArr.length - 1]
}

export const startsWithPath = (path: string) => (url: string) => url.indexOf(path) === 0
