// import all configuration data, before any actual execution
import { config } from 'dotenv'
config({ path: `${__dirname}/../config.env` })

import {
    handleUncaughtException,
    handleUnhandledRejection,
} from './utils/GlobalErrorHandler'

// handling uncaught exception on server
process.on('uncaughtException', handleUncaughtException)

// Starting actual application
import mongoose from 'mongoose'
import app from './app'

// connecting application to mongodb server
mongoose.connect(`${process.env.MONGODB}`).then(() => {
    console.log('DB connected successfully ✔')
})

// running server
const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})

// handling unhandled rejection on server
process.on('unhandledRejection', (error) => {
    handleUnhandledRejection(server, error)
})
