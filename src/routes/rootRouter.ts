import {Request, Response} from '../types'
import {handleTodosRoutes} from './todo.routes'

export const rootRouter = (req: Request, res: Response) => {
  handleTodosRoutes(req,res)
}