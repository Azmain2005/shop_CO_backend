const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  purchased: {
    type: Number,
    required: true,
  },
  selling: {
    type: Number,
    required: true,
  },
  unit: {
    type: Number,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
  },
  refundable: {
    type: String,
    enum: ["yes", 'no']
  },
  warrenty: {
    type: String,
    enum: ["yes", 'no']
  },
  photos: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: 'Values array cannot be empty.',
    },
  },
  meta_title: {
    type: String,
  },
  meta_tags: {
    type: String,
  },
  meta_description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attributes: [
    {
      title: {
        type: String,
        required: true,
      },
      values: {
        type: [String],
        required: true,
        validate: {
          validator: arr => Array.isArray(arr) && arr.length > 0,
          message: "Attribute values cannot be empty",
        },
      },
    },
  ],

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  collections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
    }
  ],
  tax: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tax',
  },
  categorie: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categorie',
    }
  ]
});

module.exports = productSchema;
