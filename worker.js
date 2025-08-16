// consumerWorker.js
require('dotenv').config(); // If you need to load .env
const { startAutoReplier } = require('./rabbitmq/autoReplier.js');
const { campaignConsumer } = require("./rabbitmq/consumer");
const { startLoggerWorker } = require('./rabbitmq/logWorker.js');
const {scheduler} = require('./rabbitmq/warmUpWorker');
const {warmupEmailConsumer } = require('./rabbitmq/warmupEmailSenderWorker');
const {connectDb}=require("./db/connectDb.js");
require("dotenv").config();

const amqp = {
  queue: "mailin",
  amqp: process.env.AMQP_URL, // e.g., from CloudAMQP
};


async function autoReplier() {
  console.log("🕓 Warmup auto-reply worker started...");

  async function run() {
    await startAutoReplier();

    const min = 50 * 60 * 1000;  // 50 minutes
    const max = 90 * 60 * 1000;  // 90 minutes

    const delay = Math.floor(Math.random() * (max - min + 1)) + min;

    // console.log(`⏳ Next run scheduled in ${(delay / 60000).toFixed(1)} minutes`);
    
    setTimeout(run, delay);
  }

  run(); // start the first run
}

const startWorker=async()=>{
try {
    await connectDb(process.env.MONGODB_URI).then(()=>{
        console.log("connected successfully...");
    })
   
// Just call the consumer ONCE
campaignConsumer(amqp, null, null);
startLoggerWorker()

scheduler()
warmupEmailConsumer()
autoReplier();
} catch (error) {  
    console.log(`connection to mongo failed ${error}`)  
}  
} 
startWorker(); 