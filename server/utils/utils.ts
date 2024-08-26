export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const workerConfigs = [
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
