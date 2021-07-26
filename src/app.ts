import http from 'http'
import {PORT, HOST_NAME} from './config/defaults'
import {rootRouter} from './routes/rootRouter'
import connect from "./db/connect";

const server = http.createServer(rootRouter)

server.listen(PORT, HOST_NAME, () => {
  connect()
  console.log(`Server running at http://${HOST_NAME}:${PORT}`)
})
