import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  productName: String,
  productDescription: {
    type:String,
    required: true,
  },
  productPrice: Number,
  productPhoto: String,
  stock:Number,
  productOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  comment: [
    {
      type: String,
      buyers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  rating: [
    {
      ratingValue: {
        type: Number,
        min: 1,
        max: 5,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("product", productSchema);
