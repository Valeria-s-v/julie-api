import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    description: { type: String, trim: true, default: '' },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    image: { type: String, trim: true, default: '' },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    highlighted: { type: Boolean, default: false },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es obligatoria'],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

