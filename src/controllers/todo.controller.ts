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
  return new Promise<ITodo>((resolve, reject) => {
    let data = ''
    try {
      req.on('data', (chunk) => (data += chunk))
      req.on('end', () => resolve(JSON.parse(data)))
    } catch (e) {
      reject(e)
    }
  })
}

export const handleTodoCreate = async (req: Request, res: Response) => {
  try {
    const data = await todosDataHandler(req)
    const todo = await TodoService.addTodo(data)
    handleResponse(201, JSON.stringify(todo), res)
  } catch (e) {
    handleTodoCreateError(e, res)
  } finally {
    res.end()
  }
}
//READ
export const handleTodoGetAll = async (req: Request, res: Response) => {
  try {
    const data = await TodoService.getAllTodos()
    res.write(JSON.stringify(data))
  } catch (e) {
    handleTodoGetAllError(res)
  } finally {
    res.end()
  }
}
export const handleTodoGetSingle = async (req: Request, res: Response, path: string) => {
  try {
    const data = await TodoService.findTodoById(getIdFromUrl(path))
    handleTodoFoundById(data, res)
  } catch (e) {
    sendNoIdResponse(res)
  } finally {
    res.end()
  }
}
//UPDATE
export const handleTodoPut = async (req: Request, res: Response, path: string) => {
  try {
    const data = await todosDataHandler(req)
    const todo = await TodoService.putTodo(getIdFromUrl(path), data)
    handleTodoFoundById(todo, res)
  } catch (e) {
    handleTodoPutError(e, res)
  } finally {
    res.end()
  }
}
export const handleTodoPatch = async (req: Request, res: Response, path: string) => {
  try {
    const data = await todosDataHandler(req)
    const todo = await TodoService.patchTodo(getIdFromUrl(path), data)
    handleTodoFoundById(todo, res)
  } catch (e) {
    handleTodoPatchError(e, res)
  } finally {
    res.end()
  }
}
//DELETE
export const handleTodoDelete = async (req: Request, res: Response, path: string) => {
  try {
    const todo = await TodoService.findAndDeleteTodo(getIdFromUrl(path))
    handleTodoFoundById(todo, res)
  } catch (e) {
    handleTodoDeleteError(res)
  } finally {
    res.end()
  }
}
