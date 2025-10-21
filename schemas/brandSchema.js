const  mongoose = require('mongoose');


const brandSchema = mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
        photoUrl: {
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});


// ✅ Virtual relationship: brand → products
// brandSchema.virtual("products", {
//   ref: "Product",          // The model to link to
//   localField: "_id",       // Brand._id
//   foreignField: "brand",   // Product.brand
// });

// // Make sure virtuals show up in JSON responses
// brandSchema.set("toJSON", { virtuals: true });
// brandSchema.set("toObject", { virtuals: true });



module.exports = brandSchema;