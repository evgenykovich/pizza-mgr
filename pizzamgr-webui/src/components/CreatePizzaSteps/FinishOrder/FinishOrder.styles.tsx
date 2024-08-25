import styled from 'styled-components'

export const FinishOrderContainer = styled.div`
  padding: 25px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
`
export const FinishOrderInnerItem = styled.div`
  margin: 15px;
  background: rgb(249, 165, 158);
  border-radius: 5px;
  color: #fff;
  box-shadow: rgb(0 0 0 / 45%) 6px 3px 6px 0px;
`

export const OrderedItemLabel = styled.div`
  font-size: 14px;
`

export const OrderedCustomerNameLabel = styled.div`
  font-size: 18px;
  font-style: italic;
  font-weight: 600;
`

export const OrderedCustomerNameLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const OrderedItem = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
  padding: 2px;
  background: grey;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
`
