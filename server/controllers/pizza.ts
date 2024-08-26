import { Request, Response } from 'express'
import { PizzaOrders, IPizzaOrder } from '../models/pizzaOrder'
import { WebSocketServer } from '../services'
import { chunkArray, wait, workerConfigs } from '../utils'

interface IWorker {
  type: string
  count: number
  processing: boolean
  processOrder: (order: IPizzaOrder) => Promise<IPizzaOrder>
}

interface IPizzaOrderWithTimestamp extends IPizzaOrder {
  timestamp: number
  timeTaken: string
}

const websocketServer = new WebSocketServer(8080)

const createWorker = (
  type: string,
  count: number,
  processOrder: (order: IPizzaOrder) => Promise<IPizzaOrder>
): IWorker => ({
  type,
  count,
  processing: false,
  processOrder,
})

const workers: IWorker[] = workerConfigs.map((config) =>
  createWorker(config.type, config.count, async (order: IPizzaOrder) => {
    console.log(`${config.type} is ${config.startStatus} for order `, order)
    order.status = config.startStatus
    websocketServer.broadcast(JSON.stringify(order))

    if (order.toppings && order.toppings.length > 0) {
      const toppingsChunks = chunkArray(order.toppings, 2)
      for (const chunk of toppingsChunks) {
        await wait(config.duration)
        console.log('Toppings added to the meal', chunk)
      }
    } else {
      await wait(config.duration)
    }

    console.log(`${config.type} finished ${config.endStatus} for order `, order)
    order.status = config.endStatus
    websocketServer.broadcast(JSON.stringify(order))
    return order
  })
)

const queue: IPizzaOrder[] = []

const enqueueOrder = async (orders: IPizzaOrder[]) => {
  const timestamp = Date.now()
  const ordersWithTimestamp = orders.map((order) => ({ ...order, timestamp }))

  queue.push(...(ordersWithTimestamp as IPizzaOrderWithTimestamp[]))
  console.log('New orders added to the queue: ', ordersWithTimestamp)

  await processQueue()

  return ordersWithTimestamp.map((order) => {
    const timeTakenMilliseconds = Date.now() - order.timestamp
    const timeTaken = ((timeTakenMilliseconds % 60000) / 1000).toFixed(0)
    return { ...order, timeTaken }
  })
}

const getAvailableWorker = (workers: IWorker[]): Promise<IWorker> => {
  return new Promise((resolve) => {
    const checkWorker = () => {
      const availableWorker = workers.find((worker) => !worker.processing)
      if (availableWorker) {
        resolve(availableWorker)
      } else {
        setTimeout(checkWorker, 1000)
      }
    }
    checkWorker()
  })
}

const processQueue = async (): Promise<void> => {
  const workerArrays = {
    cook: [] as IWorker[],
    toppingsCook: [] as IWorker[],
    ovens: [] as IWorker[],
    server: [] as IWorker[],
  }

  workers.forEach((worker) => {
    if (worker.type in workerArrays && !worker.processing) {
      for (let i = 0; i < worker.count; i++) {
        workerArrays[worker.type as keyof typeof workerArrays].push({
          ...worker,
          processing: false,
        })
      }
    }
  })

  if (Object.values(workerArrays).some((arr) => arr.length === 0)) {
    console.log('Not all worker types are available to process orders')
    return
  }

  const ordersToProcess = queue.slice(
    0,
    Math.min(
      queue.length,
      ...Object.values(workerArrays).map((arr) => arr.length)
    )
  )

  const orderProcessingPromises = ordersToProcess.map(async (order) => {
    const processStage = async (workerArray: IWorker[], stageName: string) => {
      const worker = await getAvailableWorker(workerArray)
      if (!worker) {
        console.log(`No ${stageName} available for order `, order)
        return null
      }
      worker.processing = true
      const processedOrder = await worker.processOrder(order)
      worker.processing = false
      return processedOrder
    }

    for (const [stageName, workerArray] of Object.entries(workerArrays)) {
      const result = await processStage(workerArray, stageName)
      if (!result) return
      order = result
    }

    console.log('Order completed and removed from queue', order)
  })

  await Promise.all(orderProcessingPromises)

  queue.splice(0, ordersToProcess.length)

  if (queue.length) {
    await processQueue()
  }
}

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orders: IPizzaOrder[] = req.body
  try {
    const ordersProcessed = await enqueueOrder(orders)

    const ordersFormatted = ordersProcessed.map(
      ({ customerName, dough, toppings, status, timeTaken }) => ({
        customerName,
        dough,
        toppings,
        status,
        created: new Date(),
        timeTaken,
      })
    )

    try {
      await PizzaOrders.insertMany(ordersFormatted)
      res.json(ordersProcessed)
    } catch (err) {
      console.error('Error creating order:', err)
      res.status(422).json({
        message: 'Error! could not create order',
      })
    }
  } catch (err) {
    console.error('Error processing order:', err)
    res.status(422).json({
      message: 'Error! could not create order',
    })
  }
}

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = await PizzaOrders.find()
  res.json(orders)
}

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  if (!id) {
    res.status(400).json({ message: 'Order ID is required' })
    return
  }

  try {
    const deletedOrder = await PizzaOrders.findByIdAndDelete(id)

    if (!deletedOrder) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    res.json({ message: 'Order deleted successfully', deletedOrder })
  } catch (error) {
    console.error('Error deleting order:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
