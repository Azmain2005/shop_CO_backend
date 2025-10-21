const express = require("express");
const  mongoose = require('mongoose');
const todoHandler = require("./routeHandler/todoHandler");
const reviewHandler = require("./routeHandler/reviewHandler");
const categorieHandler = require("./routeHandler/categorieHandler");
const brandHandler = require ("./routeHandler/brandHandler");
const collectionHandler = require("./routeHandler/collectionHandler");
const taxHandler = require("./routeHandler/taxHandler");
const attributeHandler = require("./routeHandler/attributeHandler");
const productHandler = require("./routeHandler/productHandler");
const subscriptionHandler = require("./routeHandler/subscriptionHandler");


const cors = require("cors"); // ✅ import cors



//express app init
const app = express();
app.use(express.json());



// ✅ enable CORS
app.use(cors()); // allow Next.js frontend only
// OR allow all origins (not recommended for production):
// app.use(cors());




//database connect
mongoose.connect('mongodb+srv://azmain2005mahtab_db_user:Azmain.2005@cluster0.6klkamu.mongodb.net/store')
.then(()=>{
    console.log("connection successfull.")
})
.catch(err => console.log(err))




//application routes
app.use('/todo',todoHandler);
app.use("/review", reviewHandler);
app.use("/categorie", categorieHandler);
app.use("/brand", brandHandler);
app.use("/collection", collectionHandler);
app.use("/tax", taxHandler);
app.use("/attribute", attributeHandler);
app.use("/product",productHandler);
app.use("/subscription",subscriptionHandler);



//error handeling default function
function errorHandler(err,req, res, next){
    if (res.headersSent){
        return next(err);
    }
    res.status(500).json({error:err});
}


app.listen(3000,() =>{
    console.log("The project started on port:3000")
})

console.log('hello world')