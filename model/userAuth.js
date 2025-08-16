const mongoose= require("mongoose");
const apiKeys= require("../API");

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    group: {type:Array},
    age: {type:Number},
    category:{type:String,default:'null'},
    phone:{type:String,default:'null'},
    website:{type:String,default:'null'},
    state:{type:String,default:'null'},
    websiteRanking:{type:Number,default:0},
    status:{type:String,default:"active"},
    condition:{type:String,default:"unverified"},
    signUpSource:{type:String},
    totalOpens:{type:Number,default:0},
    emailOpens:{type:Number,default:0},
    totalEmailSent:{type:Number,default:0},
    emailClicks:{type:Number,default:0},
    openRate:{type:Number,default:0},
    clickRate:{type:Number,default:0},
    createdAt: { type: Date, default: Date.now }, // Timestamp for each subscriber
    // createdAt: { type: Date, default:"2024-07-18T00:00:00.000Z" }, // Timestamp for each subscriber
});
const warmupInboxSchema = new mongoose.Schema({
    inbox:{
        type:String,
        unique:true,
        required:[true,"please provide a mailbox"]
       },
      firstName:{type:String, default:'Mailing_Agent'},
  appPassword: { type: String, required: true },
  isListener: { type: Boolean,default:true},
  provider: { type: String, default: "gmail" },
  dailyLimit: { type: Number, default: 4},       // Starting daily send limit
  dailyIncrease: { type: Number, default: 4 },   // How much to increase per day (configurable)
  totalEmailSent: { type: Number, default: 0 },
  lastSentDate: { type: Date, default: null },
  nextSendDate: { type: Date, default: Date.now },
  sentToday: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
 sendWindow: {
  type: Object,
  default: { start: "09:00", end: "18:00" } // Business hours by default
},
totalInboxHit:{ type: Number, default: 0 },
totalInboxSeen:{ type: Number, default: 0 },
totalReply:{ type: Number, default: 0 },
totalSpamHit:{ type: Number, default: 0 },
totalFlagged: { type: Number, default: 0 },
totalImportant: { type: Number, default: 0 },
totalInboxUnseen: { type: Number, default: 0 },
replyRate: {
    type: Number,
    default: 0.45, // 45% chance of replying to warmup emails
    min: 0,
    max: 1
  },


});
const authSchema= new mongoose.Schema({
    userName:String,
    emailSent:{
        type:Number,
        default:0
    },
    avatar:{
        type:String,
        default:"https://www.svgrepo.com/show/382109/male-avatar-boy-face-man-user-7.svg"
       
    },
    firstName:{
        type:String,
        default:" "
       
    },
    verified:{
        type:Boolean,
        default:false
       
    },
    role:{
        type:String,
        default:" "
       
    },
    lastName:{
        type:String,
        default:" "
       
    },
   email:{
    type:String,
    unique:true,
    required:[true,"please provide an email"]
   },
   password:{
    type:String,
    required:[true,"please provide a password"]
},
createdAt: { type: Date, default: Date.now },
contacts:[contactSchema],
 warmupInboxes: [warmupInboxSchema],  // Array of warmup inbox subdocuments
templates:{
    type:Array,
    default:[]
   
},
segments:{
    type:Array,
    default:[]
   
},
blogs:{
    type:Array,
    default:[]
   
},
fields:{
    type:Array,
    default:[]
   
},
groups:{
    type:Array,
    default:[]
   
},
apiKeys:{
    type:String,
    default:apiKeys() 
   
}
})
 
module.exports =mongoose.model("Users",authSchema)
