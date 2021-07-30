import { Request, Response } from '../types'
import { trimSlash } from '../utils'
import { startsWithTodoPath, todoRouter, TODOS_PATH } from './todo.routes'
import { ROOT_ROUTE } from '../config/defaults'

const hasDefaultPrefix = (url: string) => {
  return url.slice(1, ROOT_ROUTE.length + 1) === ROOT_ROUTE
}

const removeRootAndSlashesFromUrl = (url: string) => {
  return trimSlash(url.slice(ROOT_ROUTE.length + 1, url.length))
}

export const sendInvalidRequest = (res: Response) => {
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

  const url = removeRootAndSlashesFromUrl(req.url)

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
