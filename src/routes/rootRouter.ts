import { Request, Response } from '../types'
import { trimSlash } from '../utils'
import { startsWithTodoPath, todoRouter, TODOS_PATH } from './todo.routes'
import { ROOT_ROUTE } from '../config/defaults'

const hasDefaultPrefix = (url: string) => {
  return url.split('/')[1] === ROOT_ROUTE
}

//rename
const transformUrl = (url: string) => {
  return trimSlash(url.split(`${ROOT_ROUTE}`)[1]) //replace
}

const sendInvalidRequest = (res: Response) => {
  res.statusCode = 400
  res.write('Invalid request')
  res.end()
}

export const rootRouter = (req: Request, res: Response) => {
  if (!req.url) throw new Error('No url for request!')

  if (!hasDefaultPrefix(req.url)) {
    sendInvalidRequest(res)
    return
  }

  const url = transformUrl(req.url)

  switch (true) {
    case startsWithTodoPath(url):
      const path = url.slice(TODOS_PATH.length, url.length)
      todoRouter(req, res, path)
      break
    default:
      sendInvalidRequest(res)
      break
  }
}
