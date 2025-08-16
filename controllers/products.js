const express= require("express");
const app= express();
const {rabbitProvider}= require("../rabbitmq/provider")
const {rabbitconsumer}= require("../rabbitmq/consumer")
const amqplib = require('amqplib/callback_api');
const nodemailer= require('nodemailer')
require("dotenv").config();



 
const products=async(req,res)=>{
 // 1️⃣ Always allow OPTIONS for preflight
 if (req.method === 'OPTIONS') {
    const origin = req.headers.origin || '*';
    const ampSourceOrigin = req.query.__amp_source_origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'AMP-Access-Control-Allow-Source-Origin,AMP-Email-Sender'
    );
    res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin,AMP-Email-Allow-Sender');
    // v1 source-origin
    if (req.query.__amp_source_origin) {
      res.setHeader('AMP-Access-Control-Allow-Source-Origin', ampSourceOrigin);
    }
    // v2 email-sender
    const sender = req.headers['amp-email-sender'];
    if (sender) {
      res.setHeader('AMP-Email-Allow-Sender', sender);
    }
    return res.status(204).end();
  }

  // 2️⃣ Only GET for amp-list
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET,OPTIONS');
    return res.status(405).end('Method Not Allowed');
  }

  // 3️⃣ CORS v1 (Playground / validator): mirror Origin & __amp_source_origin
  const origin = req.headers.origin;
  const ampSourceOrigin = req.query.__amp_source_origin;
  if (origin && ampSourceOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
    res.setHeader('AMP-Access-Control-Allow-Source-Origin', ampSourceOrigin);
  }

  // 4️⃣ CORS v2 (Gmail/Yahoo/etc): echo AMP-Email-Sender
  const sender = req.headers['amp-email-sender'];
  if (sender) {
    res.setHeader('AMP-Email-Allow-Sender', sender);
  }

  // 5️⃣ JSON response
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    items: [
      {
        fullname: "John Doe",
        phonenumber: "212-555-1212",
        cart_items: [
          { name: "Pluot", price: "$1.00" },
          { name: "Apple", price: "$3.25" }
        ]
      }
    ]
  });
       
   }
   module.exports={products}