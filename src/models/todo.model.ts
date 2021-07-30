import mongoose from 'mongoose'
const { Schema } = mongoose

export interface ITodo extends Document {
  text: string
  isCompleted: boolean
}

export const todoSchema = new Schema<ITodo>({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
})

export const Todo = mongoose.model<ITodo>('Todo', todoSchema)
