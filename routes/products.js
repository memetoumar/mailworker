const express= require("express");
const mailRoute=express.Router();
const {products} =require("../controllers/products")



mailRoute.get("/",products);
module.exports= mailRoute  
             