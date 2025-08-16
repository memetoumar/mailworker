const mongoose= require("mongoose");
const apiKeys= require("../API");
const authSchema= new mongoose.Schema({
       publisherId:{
        type:String,
       },
       publisher:{
           type:String,
           required:[true,"invalid publisher name"]
          },
       content:{
        type:Object,
        required:[true,"no content provided"]
       },
       category:{
        type:String,
       },
      
       topic:{
        type:String,
    },slug:{
        type:String,
    },tag:{
        type:String,
    },
createdAt:{
    type:Date,
    default:Date.now() 
},

})



module.exports =mongoose.model("blogs",authSchema)