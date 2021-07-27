import {Request} from '../types'
import {ROOT_ROUTE} from '../config/defaults'
import {trimSlash} from '../utils'

export const isTodoIdPath = (url: string) => {
  const arr = url.split(`${ROOT_ROUTE}/todos/`)
  return arr.length === 2
}
export const isTodoPath = (url: string) => {
  const arr = url.split('/')
  // [_, a, b]
  // arr.shift() //remove first empty element
  return arr[1] === ROOT_ROUTE.split('/').join('') && arr[2] === 'todos'
}

//CREATE
export const isCreateTodoRequest = (req: Request) => req.method === 'POST' && req.url && trimSlash(req.url) === `${ROOT_ROUTE}/todos`
//READ
export const isGetAllTodosRequest = (req: Request) => req.method === 'GET' && req.url && trimSlash(req.url) === `${ROOT_ROUTE}/todos`
export const isGetSingleTodoRequest = (req: Request) => req.method === 'GET' && req.url && isTodoIdPath(trimSlash(req.url))
//UPDATE
export const isUpdateTodoRequest = (req: Request) => req.method === 'PUT' && req.url && isTodoIdPath(trimSlash(req.url))
export const isPatchTodoRequest = (req: Request) => req.method === 'PATCH' && req.url && isTodoIdPath(trimSlash(req.url))
//DELETE
export const isDeleteTodoRequest = (req: Request) => req.method === 'DELETE' && req.url && isTodoIdPath(trimSlash(req.url))
