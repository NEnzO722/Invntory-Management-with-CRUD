import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  price: number;
  imageUrl: string;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    subcategory: {
      type: String,
      default: '',
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    sku: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
itemSchema.index({ name: 'text', description: 'text', category: 'text', subcategory: 'text', sku: 'text' });

const Item = mongoose.model<IItem>('Item', itemSchema);
export default Item;
