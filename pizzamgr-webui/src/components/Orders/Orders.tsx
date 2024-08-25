import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CustomerNameContainer,
  CustomerNameLabel,
  OrderItemContainer,
  OrderItemsContainer,
  OrderItemSpinner,
  OrderProgress,
  OrderProgressContainer,
  OrdersByCustomerContainer,
  OrdersContainer,
  OrderTextLabel,
} from './Orders.styles'
import { createOrder } from '../../utils/actions'

interface MessagesProps {
  dough?: string
  customerName?: string
  toppings?: string[]
  status?: string
  created: Date
  inProgress: boolean
  timeTaken?: string
}

const Orders = () => {
  const isMounted = useRef(false)
  const [groupedData, setGroupedData] = useState<{
    [key: string]: MessagesProps[]
  }>({})
  const [completedOrders, setCompletedOrders] = useState<MessagesProps[]>([])
  const { state } = useLocation()

  useEffect(() => {
    const createAndRedirect = async () => {
      const orderComplete = await createOrder(state)
      setCompletedOrders((prevState) => [...prevState, orderComplete])
    }

    if (!isMounted.current) {
      isMounted.current = true
      createAndRedirect()
    }
  }, [state])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onopen = () => {
      console.log('WebSocket connection opened')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setGroupedData((groupedData) => {
        const customerName = data.customerName
        if (!groupedData[customerName]) {
          groupedData[customerName] = []
        }

        const messages = groupedData[customerName]
        const existingIndex = messages.findIndex(
          (item) => item.status === data.status
        )

        if (existingIndex >= 0) {
          messages[existingIndex].inProgress = true
        } else {
          messages.push({ ...data, inProgress: true })
        }

        messages.slice(0, -1).forEach((msg) => (msg.inProgress = false))

        return { ...groupedData }
      })
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    return () => {
      ws.close()
    }
  }, [])

  const handleFinished = (customerName: string) => {
    if (completedOrders.length) {
      const completedOrder = completedOrders.flat()
      const orderWithTimeTaken = completedOrder.filter(
        (item) => item.customerName === customerName
      )[0]
      return (
        <div>
          {`${orderWithTimeTaken.customerName}s order`} took{' '}
          {`${orderWithTimeTaken.timeTaken}s`}
        </div>
      )
    }
  }

  return (
    <OrdersContainer>
      <OrderProgress>
        {Object.entries(groupedData).map(([customerName, data]) => {
          return (
            <OrdersByCustomerContainer key={customerName}>
              <CustomerNameContainer>
                <OrderTextLabel>Pizza Progress for</OrderTextLabel>
                <CustomerNameLabel>{customerName}</CustomerNameLabel>
              </CustomerNameContainer>
              <OrderItemsContainer>
                {data.map((item, idx) => {
                  const { customerName, inProgress, status } = item
                  return (
                    <OrderProgressContainer key={`${customerName}_${idx}`}>
                      <OrderItemSpinner
                        inProgress={inProgress && status !== 'pizza delivered'}
                      >
                        <OrderItemContainer>{status}</OrderItemContainer>
                      </OrderItemSpinner>
                    </OrderProgressContainer>
                  )
                })}
              </OrderItemsContainer>
              {handleFinished(customerName)}
            </OrdersByCustomerContainer>
          )
        })}
      </OrderProgress>
    </OrdersContainer>
  )
}

export { Orders }
