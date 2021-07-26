export const trimSlash = (url: string) => url.slice(-1) === '/' ? url.slice(0, -1) : url

export const getIdFromUrl = (url: string) => {
  const urlArr = url.split('/')
  return urlArr[urlArr.length - 1]
}
