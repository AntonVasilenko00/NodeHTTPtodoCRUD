import http from 'http'
import {HOST_NAME, PORT} from './config/defaults'
import {rootRouter} from './routes/rootRouter'
import mongoose from 'mongoose'
import connect from './db/connect'

const server = http.createServer(rootRouter)

console.log('connecting to db...')
connect()
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => {
  console.log('db successfully connected')
  console.log('starting the server...')
  server.listen(PORT, HOST_NAME, () => {
    console.log(`Server running at http://${HOST_NAME}:${PORT}`)
  })
})
