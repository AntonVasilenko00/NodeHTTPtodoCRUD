import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function connect() {
  const uri = `mongodb+srv://anton:${process.env.DB_PASSWORD}@cluster0.o5l5z.mongodb.net/db?retryWrites=true&w=majority`
  mongoose.set('useNewUrlParser', true)
  mongoose.set('useUnifiedTopology', true)
  mongoose.set('useFindAndModify', false);
  await mongoose.connect(uri)
}

export default connect
