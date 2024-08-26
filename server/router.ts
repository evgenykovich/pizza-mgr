import express from 'express'
import { createOrder, getOrders, deleteOrder } from './controllers'

export default function (app: express.Application): void {
  app.post('/api/create-order', createOrder)
  app.get('/api/get-orders', getOrders)
  app.delete('/api/delete-order/:id', deleteOrder)
}
