// sentLoggerWorker.js
require("dotenv").config();
const amqp = require("amqplib");
const mongoose = require("mongoose");
const User = require("../model/userAuth"); // adjust path as needed
// 📥 RabbitMQ Setup
const RABBITMQ_URL = process.env.AMQP_URL;
const QUEUE_NAME = "sentLogs";

async function startLoggerWorker() {
  console.log("🛠️ Logger Worker starting...");

  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`📥 Waiting for messages in '${QUEUE_NAME}'`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          try {
            const content = msg.content.toString();
            const data = JSON.parse(content);
            const { userId, email } = data;

            console.log("📩 Received message in Logger Worker:", { userId, email });

            if (!userId || !email) {
              console.warn("⚠️ Missing userId or email in message:", data);
              return channel.ack(msg);
            }

            const user = await User.findById(userId);
            if (!user) {
              console.warn(`⚠️ User not found: ${userId}`);
              return channel.ack(msg);
            }

            // Find contact with case-insensitive email match
            const contact = user.contacts.find(
              (c) => c.email.toLowerCase() === email.toLowerCase()
            );

            if (!contact) {
              console.warn(`⚠️ Contact not found for email: ${email}`);
              return channel.ack(msg);
            }

            contact.totalEmailSent = (contact.totalEmailSent || 0) + 1;
            await user.save();

            console.log(`✅ Logged email sent for ${email} (user: ${userId})`);

            channel.ack(msg);
          } catch (err) {
            console.error("❌ Failed to process message:", err.message);
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("❌ Logger Worker error:", err.message);
  }
}

module.exports = { startLoggerWorker };
