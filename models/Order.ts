import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  organizationId: mongoose.Types.ObjectId;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'returned';
  items: { productId: mongoose.Types.ObjectId, quantity: number, price: number }[];
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  customerName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "returned"], default: "pending" },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    price: Number
  }]
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
