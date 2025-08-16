const express= require("express");
const mailRoute=express.Router();
const {mail} =require("../controllers/sendmail")

// send mail to queue

mailRoute.post("/",mail);

module.exports= mailRoute  
             