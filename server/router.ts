import express from 'express'
import { createOrder } from './controllers'

export default function (app: express.Application): void {
  app.post('/api/create-order', createOrder)
}
