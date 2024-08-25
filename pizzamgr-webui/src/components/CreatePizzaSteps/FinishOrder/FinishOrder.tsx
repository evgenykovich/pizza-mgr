import { OrderProps } from '../../../utils/actions'
import { PizzaStepInner } from '../CreatePizzaSteps.styles'
import {
  FinishOrderContainer,
  FinishOrderInnerItem,
  OrderedCustomerNameLabel,
  OrderedCustomerNameLabelContainer,
  OrderedItem,
  OrderedItemLabel,
} from './FinishOrder.styles'

interface FinishOrderProps {
  orders: OrderProps[]
}

const FinishOrder = ({ orders }: FinishOrderProps) => {
  return (
    <FinishOrderContainer>
      {orders.map((order) => {
        const { dough, toppings, customerName } = order
        return (
          <FinishOrderInnerItem key={customerName}>
            <PizzaStepInner>
              <OrderedCustomerNameLabelContainer>
                <OrderedItemLabel>Order for:</OrderedItemLabel>
                <OrderedCustomerNameLabel>
                  {customerName}
                </OrderedCustomerNameLabel>
              </OrderedCustomerNameLabelContainer>
              <OrderedItemLabel>Dough Selected:</OrderedItemLabel>
              <OrderedItem>{dough}</OrderedItem>
            </PizzaStepInner>
            <PizzaStepInner>
              <OrderedItemLabel>Toppings Selected:</OrderedItemLabel>
              {toppings?.map((topping) => {
                return <OrderedItem key={topping}>{topping}</OrderedItem>
              })}
            </PizzaStepInner>
          </FinishOrderInnerItem>
        )
      })}
    </FinishOrderContainer>
  )
}

export { FinishOrder }
