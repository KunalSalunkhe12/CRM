import { Schema, models, model, Document } from "mongoose";

export interface ISale extends Document {
  saleDate: Date;
  items: { name: string; quantity: number; price: number; tag: string }[];
  storeLocation: string;
  customer: {
    age: number;
    email: string;
    gender: string;
    satisfaction: number;
  };
  couponUsed: boolean;
  purchaseMethod: "In-store" | "Online" | "Phone";
}

const SaleSchema = new Schema<ISale>({
  saleDate: { type: Date, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      tag: { type: String, required: true },
    },
  ],
  storeLocation: { type: String, required: true },
  customer: {
    age: { type: Number, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    satisfaction: { type: Number, required: true },
  },
  couponUsed: { type: Boolean, required: true },
  purchaseMethod: { type: String, required: true },
});

export default models.Sale || model<ISale>("Sale", SaleSchema);
