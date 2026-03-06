// schemas/cartSchema.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    orderNote: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled"
      ],
      default: "editing"
    },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

module.exports = orderSchema;
