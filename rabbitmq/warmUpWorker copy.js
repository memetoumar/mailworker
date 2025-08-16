// scheduler.js
require("dotenv").config();
const amqp     = require("amqplib");
const mongoose = require("mongoose");
const User     = require("../model/userAuth");

const AMQP_URL   = process.env.AMQP_URL;
const QUEUE_NAME = "warmupQueue";
const MAX_SAFE   = 250;

let isRunning = false;

const SUBJECTS = [
  `first Email #`,
  `Hey there 👋`,
  `Quick Check-In`,
  `Test Email - Please Ignore`,
  `Just Warming Things Up`
];

function getRandomWarmupContent(firstName) {
  const CONTENTS = [
    `This is just a warmup message to keep things active! X-WARMUP-ID: ${firstName}`,
    `Hey ${firstName}! This is a warmup email. X-WARMUP-ID: No action needed.`,
    `You can ignore this warmup email, ${firstName}. X-WARMUP-ID: It's for deliverability.`,
    `Keeping the inbox alive with X-WARMUP-ID: this warmup!`,
    `Warming up your inbox... X-WARMUP-ID: all systems go!`
  ];

  return CONTENTS[Math.floor(Math.random() * CONTENTS.length)];
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function connectAmqp() {
  const conn    = await amqp.connect(AMQP_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log("✅ RabbitMQ connected & queue asserted");
  return channel;
}

function parseSendWindow(ref, timeStr, fallback) {
  if (!timeStr) return fallback;
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(ref);
  d.setHours(h, m, 0, 0);
  return d;
}

function getRandomMs(minMin, maxMin) {
  const min = minMin * 60 * 1000;
  const max = maxMin * 60 * 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateScheduledTimes(start, end, count) {
  const totalMs  = end - start;
  const ninetym  = totalMs * 0.9;
  const cutoff   = new Date(start.getTime() + ninetym);
  const minTotal = (count - 1) * 10 * 60 * 1000;
  const randomOK = minTotal <= ninetym;

  const slots = [];
  let cursor = new Date(start);

  for (let i = 0; i < count; i++) {
    if (i === count - 1) {
      cursor = cutoff;
    } else if (randomOK) {
      cursor = new Date(cursor.getTime() + getRandomMs(10, 30));
      if (cursor > cutoff) cursor = cutoff;
    } else {
      const spacing = ninetym / count;
      cursor = new Date(start.getTime() + spacing * i);
    }
    slots.push(new Date(cursor));
  }
  return slots;
}
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function scheduler() {
  if (isRunning) {
    console.log("⛔ Scheduler already running");
    return;
  }
  isRunning = true;

  const channel = await connectAmqp();
  console.log("🕓 Scheduler started");

  setInterval(async () => {
    const now = new Date();
    const todayKey = now.toISOString().slice(0,10);

    const users = await User.find({ "warmupInboxes.status": "active" });

    for (const u of users) {
      let dirty = false;

      for (const inbox of u.warmupInboxes) {
        if (inbox.status !== "active") continue;
        await sleep(10000 + Math.random() * 15000); // 10–25 sec delay

         // Skip inboxes that are listeners only (don't schedule sends)

  if (inbox.isListener) {
    console.log(`⏩ Skipping ${inbox.inbox} because it is a listener-only inbox`);
    continue;
  }

        // 1) Only schedule if we've hit or passed nextSendDate
        if (inbox.nextSendDate && now < new Date(inbox.nextSendDate)) {
          console.log('no inbox pass nextSendDdate')
          continue;
        }

        // 2) A fresh day? reset counters
        const lastDay = inbox.lastSentDate?.toISOString().slice(0,10) ?? null;
        if (lastDay !== todayKey) {
          console.log('fresh day started, sceduling all cold warm up emails started')
          inbox.sentToday    = 0;
          inbox.dailyLimit  += inbox.dailyIncrease;
          inbox.dailyLimit   = Math.min(inbox.dailyLimit, MAX_SAFE);
          inbox.lastSentDate = now;
          if (inbox.replyRate < 0.70) {
            inbox.replyRate += 0.02;
            inbox.replyRate = Math.min(inbox.replyRate, 0.70);
          
            // Truncate to 2 decimal places
            inbox.replyRate = Math.floor(inbox.replyRate * 100) / 100;
          }
          u.markModified("warmupInboxes");
          dirty = true;
        }

        // 3) How many to send now?
        const toSend = inbox.dailyLimit - inbox.sentToday;
        if (toSend <= 0) {
          // nothing left — schedule next shoot for tomorrow start
          const tomorrow = new Date(now.getTime() + 24*60*60*1000);
          inbox.nextSendDate = new Date(tomorrow.setHours(0,0,0,0));
          dirty = true;
          continue;
        }

        console.log(`⏩ Scheduling ${toSend} for ${inbox.inbox}`);

        // lock out further schedules until tomorrow
        const tomorrow = new Date(now.getTime() + 24*60*60*1000);
        inbox.nextSendDate = new Date(tomorrow.setHours(0,0,0,0));
        inbox.sentToday   += toSend;
        inbox.totalEmailSent  += toSend;
        dirty = true;

        // 4) Build send‐window
        const ws = parseSendWindow(now, inbox.sendWindow?.start, new Date(now.setHours(9,0,0,0)));
        const we = parseSendWindow(now, inbox.sendWindow?.end,   new Date(now.setHours(17,0,0,0)));

        // 5) Compute N timestamps
        const times = calculateScheduledTimes(ws, we, toSend);

        // 6) Recipient pool per‐inbox
          const same = u.warmupInboxes
          .filter(i => i.status === "active" && i.inbox !== inbox.inbox)
          .map(i => ({ to: i.inbox, firstName: i.firstName || 'Mailing_Agent' }));

           // flatten all active inbox emails for recipient pool
      const pool = users.flatMap(usr =>
        usr.warmupInboxes
           .filter(i=>i.status==="active")
           .map(i => ({ to: i.inbox, firstName: i.firstName || 'Mailing_Agent'  }))
      );


        // 7) Enqueue
        for (let i = 0; i < toSend; i++) {
          let destObj = same.length
            ? same[Math.floor(Math.random() * same.length)]
            : pool[Math.floor(Math.random() * pool.length)];
        
          if (!destObj) continue;
        
          const { to, firstName } = destObj;
        
          const text = getRandomWarmupContent(firstName || "Warmup");
        
          // enqueue your warmup job with: { from: inbox.inbox, to, text }
          const job = {
            userId:         u._id.toString(),
            warmupInboxId:  inbox._id.toString(),
            inbox:          inbox.inbox,
            appPassword:    inbox.appPassword,
            sequenceNumber: i + 1,
            to,
            subject:        `[Warmup] ${getRandom(SUBJECTS)}${i+1}`,
            text,
            scheduledAt:    times[i].toISOString(),
            sendWindow : { start: inbox.sendWindow?.start, end: inbox.sendWindow?.end},
          };

          channel.sendToQueue(QUEUE_NAME,
            Buffer.from(JSON.stringify(job)),
            { persistent: true }
          );
        }
      }

      if (dirty) await u.save();
    }
  }, 1000 * 60 * 0.10); // ≈ every 20s
}

module.exports = { scheduler };
