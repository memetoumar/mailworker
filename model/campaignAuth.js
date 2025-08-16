const mongoose= require("mongoose");
const apiKeys= require("../API");
const trackSchema= new mongoose.Schema({
       campaign:{
        type:String,
       },
       trackingUser:{
        type:String,
    required:[true,"please trackingUser"]

       },
       trackerId:{
        type:String,
       },
          createdAt:{
            type:Date,
            default:Date.now()
        },
          opens:{
            type:Number,
        },
        totalSubscribers:{
        type:Number,
    },
       clicks:{
        type:Number,
       },
      stats:{
    type:Array,
},
})

module.exports =mongoose.model("Campaigns",trackSchema)