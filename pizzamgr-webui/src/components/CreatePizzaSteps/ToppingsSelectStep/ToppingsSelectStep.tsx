import { ChangeEvent } from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { availableToppings } from '../../../utils/utils'
import { PizzaStepContainer } from '../CreatePizzaSteps.styles'

interface ToppingsSelectStepProps {
  handleToppings: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void
}

const ToppingsSelectStep = ({ handleToppings }: ToppingsSelectStepProps) => {
  return (
    <PizzaStepContainer>
      {availableToppings.map((topping) => {
        const { name, value } = topping
        return (
          <FormControlLabel
            key={value}
            control={<Checkbox value={value} onChange={handleToppings} />}
            label={name}
          />
        )
      })}
    </PizzaStepContainer>
  )
}

export { ToppingsSelectStep }
