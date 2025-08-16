const mongoose= require("mongoose");
const apiKeys= require("../API");
const subscribersSchema= new mongoose.Schema({
       campaign:{
        type:String,
       },
       subscribingUser:{
        type:String,
    required:[true,"please trackingUser"]

       },
       lists:{
        type:Array,
       },
        
})

module.exports =mongoose.model("SubscribersList",subscribersSchema)