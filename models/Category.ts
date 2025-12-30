import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  parentId?: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
}, { timestamps: true });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
