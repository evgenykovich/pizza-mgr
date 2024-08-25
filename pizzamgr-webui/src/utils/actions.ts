import axios from 'axios'

const ROOT_URL = '/api'

export interface OrderProps {
  dough?: string
  customerName?: string
  toppings?: string[]
  timeTaken?: string[]
}

export const createOrder = async (orders: OrderProps[]) => {
  try {
    const response = await axios.post(`${ROOT_URL}/create-order`, orders)
    return response.data
  } catch (error) {
    console.log(error)
  }
}