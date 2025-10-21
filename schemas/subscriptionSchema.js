const  mongoose = require('mongoose');


const subscriptionSchema = mongoose.Schema({
    email: {
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});



module.exports = subscriptionSchema;