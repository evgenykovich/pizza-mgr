import { useEffect, useState } from 'react'
import { getOrders, OrderProps } from '../../utils/actions'
import { OrderCard } from '../OrderCard'

export const OrdersHistory = () => {
  const [orders, setOrders] = useState<OrderProps[]>([])
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  console.log(orders)

  const renderOrder = () => {
    return orders.map((order) => (
      <div key={order._id}>
        <OrderCard order={order} />
      </div>
    ))
  }

  return <div style={{ padding: 20 }}>{renderOrder()}</div>
}
