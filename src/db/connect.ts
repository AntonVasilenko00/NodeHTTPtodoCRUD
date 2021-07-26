import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function connect() {
  const uri = `mongodb+srv://anton:${process.env.DB_PASSWORD}@cluster0.o5l5z.mongodb.net/db?retryWrites=true&w=majority`
  mongoose.set('useNewUrlParser',true)
  mongoose.set('useUnifiedTopology',true)
  mongoose.connect(uri)
  const db = mongoose.connection
  db.on('error',(err)=>console.log(err))
  db.once('open',()=>console.log('db successfully connected'))
}

export default connect
