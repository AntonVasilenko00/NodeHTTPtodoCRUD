import {Request, Response} from '../types'
import {trimSlash} from '../utils'
import {handleTodosRoutes} from '../controllers/todo.controller'
import {isTodoPath} from './todo.routes'

export const rootRouter = (req: Request, res: Response) => {
  if (req.url) {
    let url = trimSlash(req.url)
    if (isTodoPath(url))
      handleTodosRoutes(req, res)
    else {
      res.statusCode = 400
      res.write('Invalid request')
      res.end()
    }
  } else {
    throw new Error('No url for request!')
  }
}
