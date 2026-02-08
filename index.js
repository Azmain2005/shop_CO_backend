const express = require("express");
const  mongoose = require('mongoose');
const todoHandler = require("./routeHandler/todoHandler");
const reviewHandler = require("./routeHandler/reviewHandler");
const categorieHandler = require("./routeHandler/categorieHandler");
const brandHandler = require ("./routeHandler/brandHandler");
const collectionHandler = require("./routeHandler/collectionHandler");
const taxHandler = require("./routeHandler/taxHandler");
const productHandler = require("./routeHandler/productHandler");
const subscriptionHandler = require("./routeHandler/subscriptionHandler");
const userHandler = require("./routeHandler/userHandler");
const cartHandler = require("./routeHandler/cartHandler");


const cors = require("cors"); // ✅ import cors



//express app init
const app = express();
app.use(express.json());



// ✅ enable CORS
app.use(cors());




//database connect
mongoose.connect('mongodb://localhost:27017/store')
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
app.use("/product",productHandler);
app.use("/subscription",subscriptionHandler);
app.use("/user",userHandler);
app.use("/cart",cartHandler);



//error handeling default function
function errorHandler(err,req, res, next){
    if (res.headersSent){
        return next(err);
    }
    res.status(500).json({error:err});
}


app.listen(3003,() =>{
    console.log("The project started on port:3003")
})

console.log('hello world')