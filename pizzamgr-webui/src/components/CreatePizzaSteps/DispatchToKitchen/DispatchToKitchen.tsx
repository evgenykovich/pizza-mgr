import { Button } from '@mui/material'
import { DispatchToKitchenContainer } from './DispatchToKitchen.styles'

interface DispatchToKitchenProps {
  handleDispatch: () => void
}

const DispatchToKitchen = ({ handleDispatch }: DispatchToKitchenProps) => {
  return (<DispatchToKitchenContainer>
    <Button variant="contained" onClick={handleDispatch}>
      Dispatch Orders to Kitchen
    </Button>
  </DispatchToKitchenContainer>)
}

export { DispatchToKitchen }