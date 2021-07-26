import mongoose from 'mongoose';
const { Schema } = mongoose;

export const todoSchema = new Schema({
  text:  {type: String, required: true},
  isCompleted: {type: Boolean, default: false},
});

export interface ITodo extends Document {
  text: string
  isCompleted: boolean
}
export const Todo = mongoose.model('Todo', todoSchema)
