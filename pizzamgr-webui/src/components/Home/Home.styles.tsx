import styled from 'styled-components'

import BackgroundImage from '../../asssets/images/pizza-bg.png'

export const HomeContainer = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
  background-size: contain;
  background:url(${BackgroundImage}) no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OrderContainer = styled.div`
  position: absolute;
`;