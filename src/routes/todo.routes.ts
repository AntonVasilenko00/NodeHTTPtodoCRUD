import { Request, Response } from '../types'
import { isPathWithId } from '../utils'
import {
  handleTodoCreate,
  handleTodoDelete,
  handleTodoGetAll,
  handleTodoGetSingle,
  handleTodoPatch,
  handleTodoPut,
} from '../controllers/todo.controller'
import { startsWithPath } from '../utils/'
import { sendInvalidRequest } from './rootRouter'

export const TODOS_PATH = 'todos'

export const startsWithTodoPath = startsWithPath(TODOS_PATH)

export const todoRouter = (req: Request, res: Response, path: string) => {
  if (!req.method) throw new Error('No request method')

  switch (true) {
    case isCreateTodoRequest(req.method, path):
      handleTodoCreate(req, res)
      break
    case isGetSingleTodoRequest(req.method, path):
      handleTodoGetSingle(req, res, path)
      break
    case isGetAllTodosRequest(req.method, path):
      handleTodoGetAll(req, res)
      break
    case isUpdateTodoRequest(req.method, path):
      handleTodoPut(req, res, path)
      break
    case isPatchTodoRequest(req.method, path):
      handleTodoPatch(req, res, path)
      break
    case isDeleteTodoRequest(req.method, path):
      handleTodoDelete(req, res, path)
      break
    default:
      sendInvalidRequest(res)
      break
  }
}

//CREATE
export const isCreateTodoRequest = (method: string, path: string) =>
  method === 'POST' && path === ''
//READ
export const isGetAllTodosRequest = (method: string, path: string) =>
  method === 'GET' && path === ''
export const isGetSingleTodoRequest = (method: string, path: string) =>
  method === 'GET' && isPathWithId(path)
//UPDATE
export const isUpdateTodoRequest = (method: string, path: string) =>
  method === 'PUT' && isPathWithId(path)
export const isPatchTodoRequest = (method: string, path: string) =>
  method === 'PATCH' && isPathWithId(path)
//DELETE
export const isDeleteTodoRequest = (method: string, path: string) =>
  method === 'DELETE' && isPathWithId(path)
