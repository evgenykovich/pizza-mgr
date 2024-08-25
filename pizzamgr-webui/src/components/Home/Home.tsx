import React, { useState } from 'react'
import { HomeContainer, OrderContainer } from './Home.styles'
import { Button } from '@mui/material'
import { OrderModal } from '../OrderModal'

const Home = () => {
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(!open)
  }

  return (
    <HomeContainer>
      <OrderContainer>
        <Button variant="contained" onClick={handleClose}>Order Now!</Button>
      </OrderContainer>
      <OrderModal open={open} handleClose={handleClose}/>
    </HomeContainer>
  )
}

export { Home }
