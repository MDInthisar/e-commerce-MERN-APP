import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  orderedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  orderedProduct: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 0,
      },
      productPrice:Number,
    },
  ],
  totalAmount:{
    type:Number,
    default:0,
  },
  paymentMethods:{
    type:String,
    enum:['COD', 'UPI'],
  },
  orderStatus:{
    type: String,
    enum:['pending', 'confirm', 'canceled', 'placed'],
  },
  canceledAt: {
    type: Date,
    default: Date.now(),
  },
  shippingAddress: {
    doorNo: { type: String },
    streetName: { type: String },
    pincode: { type: String },
    phonoNo: { type: Number },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  message:String,
});

export default mongoose.model('order', orderSchema);