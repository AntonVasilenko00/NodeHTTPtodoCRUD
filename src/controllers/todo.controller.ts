//Request handlers
import {Request, Response} from '../types'
import {ITodo, Todo} from '../models/todo.model'
import {
  isCreateTodoRequest,
  isDeleteTodoRequest,
  isGetAllTodosRequest,
  isGetSingleTodoRequest,
  isPatchTodoRequest,
  isUpdateTodoRequest
} from '../routes/todo.routes'
import {getIdFromUrl} from '../utils'
import {CastError} from 'mongoose'

export const handleTodosRoutes = (req: Request, res: Response) => {
  if (isCreateTodoRequest(req))
    handleTodoCreate(req, res)
  else if (isGetSingleTodoRequest(req))
    handleTodoGetSingle(req, res)
  else if (isGetAllTodosRequest(req))
    handleTodoGetAll(req, res)
  else if (isUpdateTodoRequest(req))
    handleTodoPut(req, res)
  else if (isPatchTodoRequest(req))
    handleTodoPatch(req, res)
  else if (isDeleteTodoRequest(req))
    handleTodoDelete(req, res)
  else {
    res.statusCode = 400
    res.write('invalid request')
    res.end()
  }
}

//CREATE
export const handleTodoCreate = async (req: Request, res: Response) => {
  let data = ''
  req.on('data', (chunk) => data += chunk)
  req.on('end', async () => {
    try {
      const jsonData = JSON.parse(data)
      const todo = new Todo({ text: jsonData.text, isCompleted: jsonData.isCompleted || false })
      await todo.save()
      res.statusCode = 201
      res.write(JSON.stringify(todo))
    } catch (e) {
      console.log(e)
      res.statusCode = 400
      res.write(JSON.stringify({ message: 'Couldn\'t create a todo', error: e.message }))
    } finally {
      res.end()
    }
  })
}
//READ
export const handleTodoGetAll = async (req: Request, res: Response) => {
  Todo.find({})
      .then((data: ITodo[]) => res.write(JSON.stringify(data)))
      .catch((e: Error) => {
            console.log(e)
            res.statusCode = 404
            res.write('Couldn\'t get data from db')
          }
      )
      .finally(() => res.end())
}
export const handleTodoGetSingle = async (req: Request, res: Response) => {
  if (req.url)
    Todo.findById(getIdFromUrl(req.url))
        .then((data: ITodo) => {
          if (data)
            res.write(JSON.stringify(data))
          else {
            res.statusCode = 404
            res.write('Couldn\'t find item with such id')
          }
        })
        .catch((e: Error) => {
          console.log(e)
          res.statusCode = 404
          res.write('Couldn\'t get data from db')
        })
        .finally(() => res.end())
}
//UPDATE
export const handleTodoPut = (req: Request, res: Response) => {
  let data = ''
  req.on('data', (chunk) => data += chunk)
  req.on('end', async () => {
    if (req.url) {
      const jsonData = JSON.parse(data)
      Todo.findByIdAndUpdate(getIdFromUrl(req.url), jsonData, {
            overwrite: true,
            runValidators: true,
            new: true
          })
          .then((updatedTodo: ITodo) => {
            if (updatedTodo)
              res.write(JSON.stringify(updatedTodo))
            else {
              res.statusCode = 404
              res.write('Couldn\'t get data from db')
            }
          })
          .catch((e: CastError) => {
            let msg: string
            if (e.reason) {
              res.statusCode = 404
              msg = e.reason.message
            } else {
              res.statusCode = 400
              msg = e.message
            }
            res.write(JSON.stringify({ message: 'Couldn\'t update item', error: msg }))
            res.statusCode = 400
          })
          .finally(() => res.end())
    }
  })
}
export const handleTodoPatch = (req: Request, res: Response) => {
  let data = ''
  req.on('data', (chunk) => data += chunk)
  req.on('end', async () => {
    if (req.url) {
      const jsonData = JSON.parse(data)
      Todo.findByIdAndUpdate(getIdFromUrl(req.url), jsonData, { new: true })
          .then((updatedTodo: ITodo) => {
            if (updatedTodo)
              res.write(JSON.stringify(updatedTodo))
            else {
              res.statusCode = 400
              res.write('Unable to update')
            }
          })
          .catch((e: CastError) => {
            let msg: string
            if (e.reason) {
              if (e.kind === 'ObjectId') {
                res.statusCode = 404
                msg = 'Invalid ID'
              } else {
                res.statusCode = 400
                msg = e.reason.message
              }
              console.log(e)
              res.statusCode = 404
              res.write(JSON.stringify({ message: 'Couldn\'t update item', error: msg }))
            }
          })
          .finally(() => res.end())
    }
  })
}
//DELETE
export const handleTodoDelete = async (req: Request, res: Response) => {
  if (req.url) try {
    const data = await Todo.findByIdAndDelete(getIdFromUrl(req.url))
    if (data) {
      res.write(JSON.stringify(data))
    } else {
      res.statusCode = 404
      res.write('Couldn\'t find element with such id')
    }
  } catch (e) {
    console.log(e)
    res.statusCode = 404
    res.write('Couldn\'t get data from db')
  } finally {
    res.end()
  }
}
