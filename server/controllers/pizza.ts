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
  private clients: WebSocket[]

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port })
    this.clients = []

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.push(ws)
      ws.on('message', (message: string) => this.handleMessage(ws, message))
      ws.on('close', () => this.handleClose(ws))
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

  private handleClose(ws: WebSocket): void {
    const index = this.clients.indexOf(ws)
    if (index !== -1) {
      this.clients.splice(index, 1)
    }
  }
}

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

const wait = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const websocketServer = new WebSocketServer(8080)

const workers: IWorker[] = [
  {
    type: 'cook',
    count: 2,
    processing: false,
    processOrder: async (order: IPizzaOrder): Promise<IPizzaOrder> => {
      console.log('Dough Cook is preparing dough for order ', order)
      order.status = 'preparing dough'
      websocketServer.broadcast(JSON.stringify(order))
      await wait(7000)
      console.log('Dough Cook finished preparing dough for order ', order)
      order.status = 'dough prepared'
      websocketServer.broadcast(JSON.stringify(order))
      return order
    },
  },
  {
    type: 'toppingsCook',
    count: 3,
    processing: false,
    processOrder: async (order: IPizzaOrder): Promise<IPizzaOrder> => {
      console.log('Toppings Cook is handling Toppings meal for order ', order)
      order.status = 'adding toppings'
      websocketServer.broadcast(JSON.stringify(order))
      const toppingsChunks = chunkArray(order.toppings, 2)
      for (const chunk of toppingsChunks) {
        await wait(2000)
        console.log('Toppings added to the meal', chunk)
      }
      console.log('Toppings Cook finished Toppings meal for order ', order)
      order.status = 'toppings added'
      websocketServer.broadcast(JSON.stringify(order))
      return order
    },
  },
  {
    type: 'ovens',
    count: 1,
    processing: false,
    processOrder: async (order: IPizzaOrder): Promise<IPizzaOrder> => {
      console.log('Pizza is in the Oven', order)
      order.status = 'pizza in the oven'
      websocketServer.broadcast(JSON.stringify(order))
      await wait(10000)
      console.log('Pizza is out of the Oven', order)
      order.status = 'pizza out of the oven'
      websocketServer.broadcast(JSON.stringify(order))
      return order
    },
  },
  {
    type: 'server',
    count: 3,
    processing: false,
    processOrder: async (order: IPizzaOrder): Promise<IPizzaOrder> => {
      console.log('Server is delivering meal for order ', order)
      order.status = 'pizza being delivered'
      websocketServer.broadcast(JSON.stringify(order))
      await wait(5000)
      console.log('Server finished delivering meal for order ', order)
      order.status = 'pizza delivered'
      websocketServer.broadcast(JSON.stringify(order))
      return order
    },
  },
]

const queue: IPizzaOrder[] = []

const enqueueOrder = async (orders: IPizzaOrder[]) => {
  const timestamp = Date.now()
  const ordersWithTimestamp = orders.map((order) => ({ ...order, timestamp }))

  ordersWithTimestamp.forEach((order) => {
    queue.push(order as IPizzaOrderWithTimestamp)
    console.log('New order added to the queue: ', order)
  })

  await processQueue()

  return ordersWithTimestamp.map((order) => {
    const timeTakenMilliseconds = Date.now() - order.timestamp
    const timeTaken = ((timeTakenMilliseconds % 60000) / 1000).toFixed(0)
    return { ...order, timeTaken }
  })
}

const getAvailableWorker = (workers: IWorker[]): Promise<IWorker> => {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const availableWorker = workers.find((worker) => !worker.processing)
      if (availableWorker) {
        clearInterval(intervalId)
        resolve(availableWorker)
      }
    }, 1000)
  })
}

const processQueue = async (): Promise<void> => {
  const cooks: IWorker[] = []
  const toppingsCook: IWorker[] = []
  const ovens: IWorker[] = []
  const servers: IWorker[] = []

  workers.forEach((worker) => {
    const workerArray =
      worker.type === 'cook'
        ? cooks
        : worker.type === 'toppingsCook'
        ? toppingsCook
        : worker.type === 'ovens'
        ? ovens
        : worker.type === 'server'
        ? servers
        : null

    if (workerArray && !worker.processing) {
      for (let i = 0; i < worker.count; i++) {
        workerArray.push({
          ...worker,
          processing: false,
        })
      }
    }
  })

  if (
    !cooks.length ||
    !toppingsCook.length ||
    !ovens.length ||
    !servers.length
  ) {
    console.log('Not all worker types are available to process orders')
    return
  }

  const ordersToProcess = queue.slice(
    0,
    Math.min(
      queue.length,
      cooks.length,
      toppingsCook.length,
      ovens.length,
      servers.length
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

    const stages = [
      { array: cooks, name: 'cook' },
      { array: toppingsCook, name: 'topping cook' },
      { array: ovens, name: 'oven' },
      { array: servers, name: 'server' },
    ]

    for (const stage of stages) {
      const result = await processStage(stage.array, stage.name)
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

    const ordersFormatted = ordersProcessed.map((order) => ({
      customerName: order.customerName,
      dough: order.dough,
      toppings: order.toppings,
      status: order.status,
      created: new Date(),
      timeTaken: order.timeTaken,
    }))

    try {
      await PizzaOrders.insertMany(ordersFormatted)
      res.json(ordersProcessed)
    } catch (err) {
      console.log(err)
      res.status(422).json({
        message: 'Error! could not create order',
      })
    }
  } catch (err) {
    console.log(err)
    res.status(422).json({
      message: 'Error! could not create order',
    })
  }
}
