import { useEffect, useState, Fragment } from 'react'
import { AutoSizer, List } from 'react-virtualized'
import { getOrders, OrderProps } from '../../utils/actions'
import { OrderCard } from '../OrderCard'
import { OrdersHistoryContainer } from './OrderHistory.styles'

export const OrdersHistory = () => {
  const [orders, setOrders] = useState<OrderProps[]>([])
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  return (
    <OrdersHistoryContainer>
      <div>Total orders: {orders.length}</div>
      <div
        style={{
          minHeight: `${window.innerHeight * 0.82}px`,
          height: 'auto',
          width: '100%',
        }}
      >
        <AutoSizer>
          {({ height, width }) => {
            console.log('AutoSizer dimensions:', height, width)
            return (
              <List
                height={height}
                width={width}
                rowHeight={200}
                rowCount={orders.length}
                rowRenderer={({ index, style }) => {
                  console.log('Rendering row:', index)
                  return (
                    <div style={style}>
                      <OrderCard order={orders[index]} />
                    </div>
                  )
                }}
              />
            )
          }}
        </AutoSizer>
      </div>
    </OrdersHistoryContainer>
  )
}
