// schemas/cartSchema.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
          default: 1,
        },
        attributes: {
          type: Map,
          of: String,
          default: {},
        },
      },
    ],
    currency: {
      type: String,
      default: "BDT",
    },
    cartStatus: {
      type: String,
      enum: [
        "editing",
        "pending",
        "confirmed",
        "packaging",
        "shipped",
        "delivered",
        "cancelled",
        "returned"
      ],
      default: "editing"
    },

  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

module.exports = cartSchema;
