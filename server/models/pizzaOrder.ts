import mongoose, { Schema, Document } from 'mongoose'

export interface IPizzaOrder extends Document {
  customerName: string
  dough: string
  toppings: string[]
  status: string
  created: Date
  timeTaken: string
}

const pizzaOrdersSchema = new Schema<IPizzaOrder>({
  customerName: { type: String, required: true },
  dough: { type: String, required: true },
  toppings: [{ type: String }],
  status: { type: String, required: true },
  created: { type: Date, default: Date.now },
  timeTaken: { type: String },
})

const PizzaOrders = mongoose.model<IPizzaOrder>(
  'PizzaOrders',
  pizzaOrdersSchema
)

export default PizzaOrders
