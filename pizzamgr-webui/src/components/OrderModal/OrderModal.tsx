import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { CreatePizzaSteps } from '../CreatePizzaSteps'
import { OrderModalContainer } from './OrderModal.styles'

interface OrderModalProps {
  open: boolean
  handleClose: () => void
}

const OrderModal = ({ open, handleClose }: OrderModalProps) => {
  return (<OrderModalContainer>
    <Dialog
      open={ open }
      onClose={ handleClose }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Time To Build Your Pizza
      </DialogTitle>
      <DialogContent>
        <CreatePizzaSteps handleClose={ handleClose }/>
      </DialogContent>
    </Dialog>
  </OrderModalContainer>)
}

export { OrderModal }