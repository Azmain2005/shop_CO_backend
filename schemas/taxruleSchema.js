const  mongoose = require('mongoose');


const taxruleSchema = mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    description: String,
    type:{
        type: String,
        required:true,
        enum:["number",'percent'],
    },
    number:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});



module.exports = taxruleSchema;