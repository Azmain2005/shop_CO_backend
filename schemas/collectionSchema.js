const  mongoose = require('mongoose');


const collectionSchema = mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    description: String,
    date:{
        type:Date,
        default:Date.now,
    },
});




module.exports = collectionSchema;