const mongoose = require('mongoose');

const attributeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  values: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: 'Values array cannot be empty.',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = attributeSchema;
