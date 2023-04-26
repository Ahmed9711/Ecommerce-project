import express from 'express'
import { config } from 'dotenv'
import { initiateApp } from './src/utils/initiateApp.js'

const app = express()
config({path: './Config/config.env'})

initiateApp(app, express)
