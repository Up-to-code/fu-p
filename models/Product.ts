import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  stock: number;
  brand: string;
  status: 'draft' | 'active';
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  brand: { type: String },
  status: { type: String, enum: ["draft", "active"], default: "draft" },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
