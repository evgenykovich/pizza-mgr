import {
  HeaderContainer,
  HeaderLink,
  HeaderLinksContainer,
  HeaderLogo,
} from './Header.styles'

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderLogo />
      <HeaderLinksContainer>
        <HeaderLink to="/">Home</HeaderLink>
        <HeaderLink to="/orders">Orders</HeaderLink>
        <HeaderLink to="/orders-history">Orders History</HeaderLink>
      </HeaderLinksContainer>
    </HeaderContainer>
  )
}

export { Header }
