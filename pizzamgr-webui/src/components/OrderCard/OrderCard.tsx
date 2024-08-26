import { Button, Card, CardContent, Typography } from '@mui/material'
import { deleteOrder, OrderProps } from '../../utils/actions'

type OrderCardProps = {
  order: OrderProps
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const handleDelete = async () => {
    await deleteOrder(order._id || '')
  }
  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {order.customerName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Dough: {order.dough}
        </Typography>
        <Typography variant="body2">
          Toppings: {order.toppings?.join(', ')}
        </Typography>
        {order.timeTaken && (
          <Typography variant="body2">Time Taken: {order.timeTaken}</Typography>
        )}
        <Button
          variant="contained"
          color="error"
          sx={{ marginTop: 2 }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  )
}
