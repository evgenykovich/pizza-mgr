import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material'
import { DoughSelectStep } from './DoughSelectStep'
import { ToppingsSelectStep } from './ToppingsSelectStep'
import { FinishOrder } from './FinishOrder'
import { OrderProps } from '../../utils/actions'
import { DispatchToKitchen } from './DispatchToKitchen'

const steps = ['Select dough', 'Select Toppings', 'Confirm Orders']

interface CreatePizzaStepsProps {
  handleClose: () => void
}

const CreatePizzaSteps = ({ handleClose }: CreatePizzaStepsProps) => {
  const [activeStep, setActiveStep] = useState(0)
  const [dough, setDough] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [toppings, setToppings] = useState<string[]>([])
  const [orders, setOrders] = useState<OrderProps[]>([])

  const navigate = useNavigate()

  const handleReset = () => {
    setToppings([])
    setDough('')
    setCustomerName('')
  }

  const handleDoughChange = (event: SelectChangeEvent) => {
    setDough(event.target.value)
  }

  const handleToppings = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const topping = event.target.value
    setToppings((prevArray) => [...prevArray, topping])
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    if (activeStep === 1) {
      const orderData = {
        customerName,
        dough,
        toppings,
      }

      setOrders((prevArray) => [...prevArray, orderData])
    }
  }

  const handleDispatch = () => {
    handleReset()
    handleClose()
    navigate('/orders', { state: orders })
  }

  const handleAnotherOrder = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep = 0))
    handleReset()
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setCustomerName(name)
  }

  const renderProgressByStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <DoughSelectStep
            dough={dough}
            handleChange={handleDoughChange}
            onNameChange={onNameChange}
          />
        )
      case 1:
        return <ToppingsSelectStep handleToppings={handleToppings} />
      case 2:
        return <FinishOrder orders={orders} />
      case 3:
        return <DispatchToKitchen handleDispatch={handleDispatch} />
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {renderProgressByStep()}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleClose}>close</Button>
          {(dough && activeStep === 0 && customerName && activeStep === 0) ||
          (toppings.length && activeStep === 1) ||
          activeStep === 2 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : null}
          {activeStep === 2 && (
            <Button variant="contained" onClick={handleAnotherOrder}>
              Add another order
            </Button>
          )}
        </Box>
      </div>
    </Box>
  )
}

export { CreatePizzaSteps }
