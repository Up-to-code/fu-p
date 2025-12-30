import mongoose, { Schema, Document, Model } from "mongoose";

export type ApprovalStatus = 'pending' | 'action_required' | 'approved' | 'rejected';

export interface IOrganization extends Document {
  name: string;
  description?: string;
  logo?: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  status: ApprovalStatus;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  logo: { type: String, default: "" },
  slug: { type: String, required: true, unique: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "action_required", "approved", "rejected"],
    default: "pending",
  },
  memberCount: {
    type: Number,
    default: 1, // Starts at 1 (owner)
  },
  },
  { timestamps: true }
);

const Organization: Model<IOrganization> =
  mongoose.models.Organization || mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default Organization;
