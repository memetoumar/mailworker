require("dotenv").config();
const amqp = require("amqplib");
const mongoose = require("mongoose");
const User = require("../model/userAuth");
const { DateTime } = require("luxon");
const getRandomWarmupContent= require("../content");


const AMQP_URL = process.env.AMQP_URL;
const QUEUE_NAME = "warmupQueue";
const MAX_SAFE = 6;

let isRunning = false;

const SUBJECTS =[
  `Inquiry About Upcoming E-commerce Project`,
  `Interesting Possibility at Quantum Bites Tech`, 
  `Potential Challenges with Our Recent Facebook Ad Campaigns`,
  `Inquiry on Branding and Logo Design Philosophy`,
  `Exploring Advanced Email Services for Enhanced Lead Generation`,
  `Outstanding Payment and Banking Update`,
  `Recent House listing in Miami by SPA Company`,
  `Proposal for a Website Development Preview`, 
  `Harnessing Google Ads in Our Quest for Knowledge`,
  `Enhancing Our Journey with Effective Email Services`,
  `Soaring High with Our Email Campaign Achievements!`, 
  `Quick Follow-Up: Elevate Your Customer Growth`,
  `Votre avis sur nos dernières améliorations de service`,
  `A Web of Creativity Awaits Us`,
  `Let's dive into E-commerce Analytics and Metrics`,
  `Maximizing Customer Growth through Strategic Email Services`, 
  `Innovations in Our Marketing Tools: Seeking Your Valued Feedback`, 
  `Immediate Assistance Needed on the Web Development Front`,
  `Diving Deep into Promotions Tools Evaluation!`,
  `Plan of Effort for SEO Services`, 
  `Elevating Our Brand Essence Through Strategic Logo Design`,
  `Plan of Effort  for Web Design Services`, 
  `Welcome Aboard, Bobby Donev! who is your guarantor `, 
  `Leveraging Online Promotions for Health Education Success`, 
  `Let's dive into Quality Assurance and Testing`,
  `Quick Question`,
  `Let's dive into Construction Tutorials and Testing`,
  `Plan of effort for teaching Email deliverability` 
]


function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function connectAmqp() {
  const conn = await amqp.connect(AMQP_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log(" RabbitMQ connected & queue asserted");
  return channel;
}

// function parseSendWindow(ref, timeStr, fallback) {
//   if (!timeStr) return fallback;
//   const [h, m] = timeStr.split(":").map(Number);
//   const d = new Date(ref);
//   d.setHours(h, m, 0, 0);
//   return d;
// }
function parseSendWindow(ref, timeStr, fallback) {
  if (!timeStr) return fallback instanceof DateTime ? fallback : DateTime.fromJSDate(fallback).setZone("Africa/Lagos");

  const [h, m] = timeStr.split(":").map(Number);
  return DateTime.fromJSDate(ref)
    .setZone("Africa/Lagos")
    .set({ hour: h, minute: m, second: 0, millisecond: 0 });
}



function getRandomMs(minMin, maxMin) {
  const min = minMin * 60 * 1000;
  const max = maxMin * 60 * 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function calculateScheduledTimes(start, end, count) {
  if (!start.isValid || !end.isValid) {
    console.error("❌ Invalid start or end time passed to calculateScheduledTimes", { start, end });
    return [];
  }

  const startLuxon = start; // no fromJSDate
  const endLuxon = end;     // no fromJSDate

  const totalMs = endLuxon.diff(startLuxon).as("milliseconds");
  const ninetym = totalMs * 0.90;

  const cutoff = startLuxon.plus({ milliseconds: ninetym });
  const minTotal = (count - 1) * 10 * 60 * 1000; // minimum spacing total
  const randomOK = minTotal <= ninetym;

  const slots = [];
  let cursor = startLuxon;

  for (let i = 0; i < count; i++) {
    if (i === count - 1) {
      cursor = cutoff;
    } else if (randomOK) {
      const delay = getRandomMs(10, 30);
      cursor = cursor.plus({ milliseconds: delay });
      if (cursor > cutoff) cursor = cutoff;
    } else {
      const spacing = ninetym / count;
      cursor = startLuxon.plus({ milliseconds: spacing * i });
    }
    slots.push(cursor);
  }

  return slots;
}



function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function warmUpScheduler() {
  if (isRunning) {
    console.log(" Scheduler already running");
    return;
  }
  isRunning = true;

  const channel = await connectAmqp();
  console.log("Scheduler started");

  async function runCycle() {
    try {
      const now = DateTime.now().setZone("Africa/Lagos");
      const todayKey = now.toISODate(); // returns "YYYY-MM-DD"
      const users = await User.find({ "warmupInboxes.status": "active" });

      for (const u of users) {
        let dirty = false;

        for (const inbox of u.warmupInboxes) {
          if (inbox.status !== "active") continue;
          await sleep(6000 + Math.random() * 12000);

          if (inbox.isListener) {
            console.log(`Skipping ${inbox.inbox} because it is a listener-only inbox`);
            continue;
          }

        // 1. Handle fresh day reset first
const lastDay = inbox.lastSentDate?.toISOString().slice(0, 10) ?? null;
if (lastDay !== todayKey) {
  console.log('fresh day started, scheduling all cold warm up emails started');
  inbox.sentToday = 0;
  inbox.dailyLimit += inbox.dailyIncrease;
  inbox.dailyLimit = Math.min(inbox.dailyLimit, MAX_SAFE);
  inbox.lastSentDate = now;
  if (inbox.replyRate < 0.70) {
    inbox.replyRate += 0.02;
    inbox.replyRate = Math.min(inbox.replyRate, 0.70);
    inbox.replyRate = Math.floor(inbox.replyRate * 100) / 100;
  }
  dirty = true;
}

// ✅ Then check if it's too early to send again
if (inbox.nextSendDate && now < DateTime.fromJSDate(inbox.nextSendDate).setZone("Africa/Lagos")) {
  console.log(` Skipping ${inbox.inbox} due to future nextSendDate: ${inbox.nextSendDate}`);
  continue;
}


          const toSend = inbox.dailyLimit - inbox.sentToday;
          if (toSend <= 0) {
           const tomorrow = now.plus({ days: 1 }).startOf('day');
           inbox.nextSendDate = tomorrow.toJSDate(); // Already start of day
            dirty = true;
            continue;
          }

          console.log(`Scheduling ${toSend} for ${inbox.inbox}`);

          const tomorrow = now.plus({ days: 1 }).startOf('day');
          inbox.nextSendDate = tomorrow.toJSDate();
          inbox.sentToday += toSend;
          inbox.totalEmailSent += toSend;
          dirty = true;

  const ws = parseSendWindow(now.toJSDate(), inbox.sendWindow?.start, new Date());
const we = parseSendWindow(now.toJSDate(), inbox.sendWindow?.end, new Date());
   const times = calculateScheduledTimes(ws, we, toSend);

        
          const pool = users.flatMap(usr =>
            usr.warmupInboxes
              .filter(i => i.status === "active" && i.inbox !== inbox.inbox)
              .map(i => ({ to: i.inbox, firstName: i.firstName}))
          );

          for (let i = 0; i < toSend; i++) {
            // let destObj = same.length
            //   ? same[Math.floor(Math.random() * same.length)]
            //   : pool[Math.floor(Math.random() * pool.length)];
              let destObj = pool[Math.floor(Math.random() * pool.length)];

            if (!destObj) continue;

            const { to, firstName } = destObj;
            const text = getRandomWarmupContent(firstName,inbox.firstName);

            const job = {
              userId: u._id.toString(),
              warmupInboxId: inbox._id.toString(),
              inbox: inbox.inbox,
              appPassword: inbox.appPassword,
              firstName:inbox.firstName,
              sequenceNumber: i + 1,
              to,
              subject: `[Warmup] ${getRandom(SUBJECTS)}${i + 1}`,
              text,
              scheduledAt: times[i].toISO(),
              sendWindow: { start: inbox.sendWindow?.start, end: inbox.sendWindow?.end },
            };


            channel.sendToQueue(QUEUE_NAME,
              Buffer.from(JSON.stringify(job)),
              { persistent: true }
            );
          }
        }

        if (dirty) await u.save();
      }
    } catch (err) {
      console.error(" Scheduler error:", err);
    } finally {
      setTimeout(runCycle, 40 * 60 * 1000);
      isRunning = false;
    }
  }

  runCycle();
}

module.exports = { warmUpScheduler };
