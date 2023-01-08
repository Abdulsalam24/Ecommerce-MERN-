// import 'dotenv/config'
import express from 'express'
import path from 'path';
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import keys from './config/keys.js'
import router from './routes/index.js'
import { requestLogger, errorHandler } from './middleware/index.js'
import seedDatabase from './seedDatabase.js'
import createError from 'http-errors'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);


mongoose.connect(keys.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

mongoose.connection.on('connected', () => {
  console.log('connected to mongoDB')
  seedDatabase()
})

mongoose.connection.on('error', (err) => {
  console.log('err connecting', err)
})

const app = express()

// middleware
app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(requestLogger)

// api router
// app.use(`/${keys.app.apiEndpoint}`, router)
app.use(keys.app.apiEndpoint, router)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'NotFound'))
})

app.listen(3001, () => {
  console.log('listening to ')
})
// error handler
app.use(errorHandler)


export default app
