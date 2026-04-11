const mongoose = require('mongoose');


const categorieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["parent", 'child'],
    },
    parentid: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});



module.exports = categorieSchema;