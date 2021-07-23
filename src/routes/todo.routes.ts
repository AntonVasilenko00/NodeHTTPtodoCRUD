import {Request, Response} from '../types'
import {ROOT_ROUTE} from '../config/defaults'
import trimSlash from '../utils/trimSlash'

export const handleTodosRoutes = (req: Request, res: Response) => {
  let url = trimSlash(req.url!)
//  CREATE
  handleTodoCreate(req,res,url)
//  READ
  if (req.method === 'GET') {
    res.write('todos')
    res.end()
  }
//  UPDATE

//  DELETE
}

const handleTodoCreate = (req: Request, res: Response, url: string) => {
  if (req.method === 'POST' && url === `${ROOT_ROUTE}/todos`) {
    let data = ''
    req.on('data', (chunk) => data += chunk)
    req.on('end', ()=>{
      console.log(data)
      res.write('posted')
      res.end()
    })
  }
}

const handleTodoUpdate = (req: Request, res: Response, url: string) => {
  if (req.method === 'POST' && url === `${ROOT_ROUTE}/todos`) {
  }
}

const handleTodoRead = (req: Request, res: Response, url: string) => {
  if (req.method === 'POST' && url === `${ROOT_ROUTE}/todos`) {
  }
}

const handleTodoDelete = (req: Request, res: Response, url: string) => {
  if (req.method === 'POST' && url === `${ROOT_ROUTE}/todos`) {
  }
}
