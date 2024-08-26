import WebSocket from 'ws'
import PizzaOrders, { IPizzaOrder } from '../models/pizzaOrder'

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

class WebSocketServer {
  private wss: WebSocket.Server
  private clients: Set<WebSocket>

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port })
    this.clients = new Set()

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws)
      ws.on('message', (message: string) => this.handleMessage(ws, message))
      ws.on('close', () => this.clients.delete(ws))
    })
  }

  broadcast(message: string): void {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }

  private handleMessage(ws: WebSocket, message: string): void {
    console.log('received: %s', message)
  }
}

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

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

const workerConfigs = [
  {
    type: 'cook',
    count: 2,
    startStatus: 'preparing dough',
    endStatus: 'dough prepared',
    duration: 7000,
  },
  {
    type: 'toppingsCook',
    count: 3,
    startStatus: 'adding toppings',
    endStatus: 'toppings added',
    duration: 2000,
    hasToppings: true,
  },
  {
    type: 'ovens',
    count: 1,
    startStatus: 'pizza in the oven',
    endStatus: 'pizza out of the oven',
    duration: 10000,
  },
  {
    type: 'server',
    count: 3,
    startStatus: 'pizza being delivered',
    endStatus: 'pizza delivered',
    duration: 5000,
  },
]

const workers: IWorker[] = workerConfigs.map((config) =>
  createWorker(config.type, config.count, async (order: IPizzaOrder) => {
    console.log(`${config.type} is ${config.startStatus} for order `, order)
    order.status = config.startStatus
    websocketServer.broadcast(JSON.stringify(order))

    if (config.hasToppings) {
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

export const createOrder = async (req: any, res: any): Promise<void> => {
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
