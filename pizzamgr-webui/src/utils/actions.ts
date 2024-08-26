import axios from 'axios'

const ROOT_URL = '/api'

export interface OrderProps {
  _id?: string
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

export const getOrders = async () => {
  try {
    const response = await axios.get(`${ROOT_URL}/get-orders`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const deleteOrder = async (id: string) => {
  try {
    debugger
    const response = await axios.delete(`${ROOT_URL}/delete-order/${id}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
