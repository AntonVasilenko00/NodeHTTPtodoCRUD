//Request handlers
import { Request, Response } from '../types'
import { ITodo } from '../models/todo.model'
import { getIdFromUrl } from '../utils'
import { CastError } from 'mongoose'
import * as TodoService from '../services/todo.service'

//CREATE

const sendNoIdResponse = (res: Response) => {
  handleResponse(404, "Couldn't find item with such id", res)
}

const handleResponse = (statusCode: number, responseMessage: string, res: Response) => {
  res.statusCode = statusCode
  res.write(responseMessage)
}

const handleTodoPutError = (e: CastError, res: Response) => {
  const errorMessage = e.reason ? e.reason.message : e.message
  const statusCode = e.reason ? 404 : 400
  const responseMessage = JSON.stringify({ message: "Couldn't update item", error: errorMessage })
  handleResponse(statusCode, responseMessage, res)
}

const handleTodoPatchError = (e: CastError, res: Response) => {
  const err = e.reason ? (e.kind === 'ObjectId' ? 'Invalid Id' : e.reason.message) : e.message //norm?
  const statusCode = e.reason ? (e.kind === 'ObjectId' ? 404 : 400) : 400
  const responseMessage = JSON.stringify({ message: "Couldn't update item", error: err })
  handleResponse(statusCode, responseMessage, res)
}

const handleTodoGetAllError = (res: Response) => {
  handleResponse(404, "Couldn't get data from db", res)
}

const handleTodoCreateError = (e: Error, res: Response) => {
  handleResponse(400, JSON.stringify({ message: "Couldn't create a todo", error: e.message }), res)
}

const handleTodoDeleteError = (res: Response) => {
  handleResponse(400, "Couldn't delete item", res)
}

const handleTodoFoundById = (data: ITodo | null, res: Response) => {
  data ? res.write(JSON.stringify(data)) : sendNoIdResponse(res)
}

const todosDataHandler = (req: Request) => {
  return new Promise<ITodo>((resolve) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolve(JSON.parse(data)))
  })
}

//async await
export const handleTodoCreate = (req: Request, res: Response) => {
  todosDataHandler(req)
    .then((data) => {
      return TodoService.addTodo(data)
    })
    .then((todo) => {
      res.statusCode = 201
      res.write(JSON.stringify(todo))
    })
    .catch((e) => handleTodoCreateError(e, res))
    .finally(() => res.end())
}
//READ
export const handleTodoGetAll = (req: Request, res: Response) => {
  TodoService.getAllTodos()
    .then((data) => res.write(JSON.stringify(data)))
    .catch(() => handleTodoGetAllError(res))
    .finally(() => res.end())
}
export const handleTodoGetSingle = (req: Request, res: Response, path: string) => {
  TodoService.findTodoById(getIdFromUrl(path))
    .then((data) => handleTodoFoundById(data, res))
    .catch(() => sendNoIdResponse(res))
    .finally(() => res.end())
}
//UPDATE
export const handleTodoPut = (req: Request, res: Response, path: string) => {
  todosDataHandler(req).then((data) => {
    TodoService.putTodo(getIdFromUrl(path), data)
      .then((data) => handleTodoFoundById(data, res))
      .catch((e) => handleTodoPutError(e, res))
      .finally(() => res.end())
  })
}
export const handleTodoPatch = (req: Request, res: Response, path: string) => {
  todosDataHandler(req).then((data) => {
    TodoService.patchTodo(getIdFromUrl(path), data)
      .then((data) => handleTodoFoundById(data, res))
      .catch((e) => handleTodoPatchError(e, res))
      .finally(() => res.end())
  })
}
//DELETE
export const handleTodoDelete = (req: Request, res: Response, path: string) => {
  TodoService.findAndDeleteTodo(getIdFromUrl(path))
    .then((data) => handleTodoFoundById(data, res))
    .catch(() => handleTodoDeleteError(res))
    .finally(() => res.end())
}
