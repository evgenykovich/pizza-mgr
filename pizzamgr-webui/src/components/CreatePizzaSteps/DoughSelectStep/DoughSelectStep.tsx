import { ChangeEvent } from 'react'
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { PizzaStepContainer, PizzaStepInner } from '../CreatePizzaSteps.styles'
import { doughsAvailable } from '../../../utils/utils'

interface DoughSelectStepProps {
  dough: string
  handleChange: (event: SelectChangeEvent) => void
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const DoughSelectStep = ({
  dough,
  handleChange,
  onNameChange,
}: DoughSelectStepProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <PizzaStepContainer>
      <PizzaStepInner>
        <Typography>Enter your name:</Typography>
        <Input onChange={onNameChange} />
      </PizzaStepInner>
      <PizzaStepInner>
        <Typography>please select the dough:</Typography>
        <FormControl
          size="small"
          sx={{
            width: isSmallScreen ? '200px' : '100%',
          }}
        >
          <InputLabel id="demo-select-small-label">Dough</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={dough}
            label="Dough"
            onChange={handleChange}
          >
            {doughsAvailable.map((dough) => {
              const { name, value } = dough
              return (
                <MenuItem key={value} value={value}>
                  {name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </PizzaStepInner>
    </PizzaStepContainer>
  )
}

export { DoughSelectStep }
