import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    doorNo: { type: String },
    streetName: { type: String },
    pincode: { type: String },
    phonoNo: { type: Number },
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
  profilePic: {
    type: String,
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
});

export default mongoose.model("user", userSchema);
