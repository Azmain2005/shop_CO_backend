const  mongoose = require('mongoose');


const categorieSchema = mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});



module.exports = categorieSchema;