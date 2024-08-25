import styled from 'styled-components'
import { Link } from 'react-router-dom'
import LogoImage from '../../asssets/images/pizza-logo.png'

export const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e13e2f;
  box-shadow: #e13e2f 0 0 20px 0;
  background: #fff;
`

export const HeaderLinksContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
`

export const HeaderLink = styled(Link)`
  color: #e13e2f;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  margin: 10px;

  &:hover,
  &:focus {
    color: #f9a59e;
  }
`

export const HeaderLogo = styled.img.attrs({
  src: `${LogoImage}`,
})`
  width: 100%;
  height: 100%;
  max-width: 75px;
  max-height: 75px;
`
