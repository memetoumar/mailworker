const mongoose= require("mongoose");
const apiKeys= require("../API");
const authSchema= new mongoose.Schema({
    verified:{
        type:Boolean,
       }, 
       publisherId:{
        type:String,
       },
       publisher:{
           type:String,
           required:[true,"invalid publisher name"]
          },
          templateName:{
            type:String,
        },
    price:{
        type:Number,
    },
       tested:{
        type:Boolean,
       },
       downloaded:{
        type:Number,
       },
       img:{
        type:String,
        required:[true,"no template preview"]
       },
       newContent:{
        type:Object,
        required:[true,"no code provided"]
       },
       category:{
        type:String,
       },
      
   tag:{
    type:String,
},
createdAt:{
    type:Date,
    default:Date.now()
},

})



module.exports =mongoose.model("publishedTemplates",authSchema)