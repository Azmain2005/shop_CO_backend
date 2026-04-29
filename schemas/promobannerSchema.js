const  mongoose = require('mongoose');


const promobannerSchema = mongoose.Schema({
    text: {
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});


module.exports = promobannerSchema;