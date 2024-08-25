import styled from 'styled-components'

import BackgroundImage from '../../asssets/images/pizza-orders-bg.png'

export const OrdersContainer = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
  background-size: contain;
  background:url(${BackgroundImage}) no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const OrderProgress = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 25px;
`

export const OrderProgressContainer = styled.div`
  display: flex;
`

export const OrderItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const OrderItemContainer = styled.div`
  font-size: 18px;
`

export const CustomerNameLabel = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  font-style: italic;
`

export const OrderTextLabel = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-right: 15px;
`

export const CustomerNameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: rgb(120 8 8 / 41%);
  padding-left: 10px;
  padding-right: 10px;
`

export const OrdersByCustomerContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
`

export const OrderItemSpinner = styled.div<{ inProgress: boolean }>`
  font-weight: ${p => (p.inProgress ? '600' : '400')};
  margin: 15px;
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid palevioletred;
  background: ${p => (p.inProgress ? 'none' : 'rgb(219 112 147 / 26%);')};
  color: ${p => (p.inProgress ? 'palevioletred' : '#fff')};
  border-radius: 50%;

  &:before, &:after {
    display: ${p => (p.inProgress ? 'block' : 'none')};
    content: '';
    border-radius: 50%;
    position: absolute;
    inset: 0;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
  }

  &:after {
    box-shadow: 0 2px 0 #FF3D00 inset;
    animation: rotate 2s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
`