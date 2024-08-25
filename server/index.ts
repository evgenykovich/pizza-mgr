import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import router from './router'

const app: express.Application = express()

mongoose.Promise = global.Promise

// mongoose.connect('mongodb://127.0.0.1:27017/pizza', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connect(
  'mongodb+srv://evgenykovich:Qwerty78()@cluster0.exritzi.mongodb.net/pizza'
)

app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))

router(app)

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3090
const server: http.Server = http.createServer(app)
server.listen(port)
console.log('Server listening on: ', port)
