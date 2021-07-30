import { ITodo, Todo } from '../models/todo.model'
import { getIdFromUrl } from '../utils'

export async function addTodo(data: ITodo) {
  const todo = new Todo({ text: data.text, isCompleted: data.isCompleted || false })
  return todo.save()
}

export async function getAllTodos() {
  return Todo.find({})
}

export async function findTodoById(id: string) {
  return Todo.findById(id)
}

export async function putTodo(id: string, data: ITodo) {
  return Todo.findByIdAndUpdate(id, data, {
    overwrite: true,
    runValidators: true,
    new: true,
  })
}

export async function patchTodo(id: string, data: ITodo) {
  return Todo.findByIdAndUpdate(id, data, { new: true })
}

export async function findAndDeleteTodo(id: string) {
  return Todo.findByIdAndDelete(id)
}
