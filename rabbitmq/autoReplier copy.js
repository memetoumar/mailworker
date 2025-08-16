// rabbitmq/autoReplier.js
require("dotenv").config();
const imaps = require("imap-simple");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require("../model/userAuth");
let isRunning = false;
async function withTimeout(promise, ms, label) {
  let timeout;
  const timer = new Promise((_, rej) =>
    timeout = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timer]).finally(() => clearTimeout(timeout));
}

async function startAutoReplier() {
  if (isRunning) {
    console.log("⛔ Scheduler already running");
    return;
  }
  isRunning = true;
  console.log("🚀 Starting auto‑replier...");

  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  const users = await User.find({ "warmupInboxes.status": "active" });
  console.log(`👥 Found ${users.length} user(s)`);

  for (const user of users) {
    for (const inboxCfg of user.warmupInboxes) {
      if (inboxCfg.status !== "active") continue;
      const { inbox, appPassword } = inboxCfg;

      console.log(`\n📥 Checking inbox: ${inbox}`);
      let connection;
      try {
        connection = await withTimeout(
          imaps.connect({
            imap: {
              user: inbox,
              password: appPassword,
              host: "imap.gmail.com",
              port: 993,
              tls: true,
              tlsOptions: { rejectUnauthorized: false },
              authTimeout: 30000
            }
          }),
          10000,
          "IMAP connect"
        );
        console.log("   ▶️ IMAP connected");
      } catch (err) {
        console.error(`   ❌ IMAP connect failed for ${inbox}:`, err.message);
        continue;
      }

      try {
        await withTimeout(connection.openBox("INBOX"), 5000, "openBox");
        console.log("   📂 INBOX opened");
      } catch (err) {
        console.error(`   ❌ openBox failed for ${inbox}:`, err.message);
        connection.end();
        continue;
      }

      let messages = [];
      try {
        const sinceDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const sinceStr = sinceDate.toISOString();
        console.log(`   🔍 Searching for UNSEEN since ${sinceStr}...`);
        messages = await withTimeout(
          connection.search(["UNSEEN", ["SINCE", sinceStr]], {
            bodies: ["HEADER.FIELDS (FROM SUBJECT)"],
            markSeen: false
          }),
          10000,
          "search headers"
        );
        console.log(`   🔍 ${messages.length} unseen message(s) found`);
      } catch (err) {
        console.error(`   ❌ Search failed for ${inbox}:`, err.message);
      }

      for (const msg of messages) {
        const headerPart = msg.parts.find(p => p.which === "HEADER.FIELDS (FROM SUBJECT)");
        const fromHeader = headerPart?.body.from?.[0] || "";
        const subject = headerPart?.body.subject?.[0] || "";

        console.log(`   ✉️  Header: From=${fromHeader} | Subject="${subject}"`);

        if (!subject.startsWith("[Warmup]")) {
          console.log("      ⏩ Skipped: subject not [Warmup]");
          await connection.addFlags(msg.attributes.uid, "\\Seen");
          continue;
        }

        // ✅ FIXED: Correct way to fetch the body
        let rawBody = "";
        try {
          console.log("      📥 Fetching TEXT body...");
          const fullMsg = await withTimeout(
            connection.search([["UID", msg.attributes.uid]], {
              bodies: ["TEXT"],
              struct: true
            }),
            10000,
            "fetch body"
          );
          rawBody = fullMsg?.[0]?.parts?.[0]?.body?.toString() || "";
          console.log("      📄 Body snippet:", rawBody.slice(0, 60).replace(/\n/g, " ") + "…");
        } catch (err) {
          console.error(`      ❌ Fetch body failed:`, err.message);
          await connection.addFlags(msg.attributes.uid, "\\Seen");
          continue;
        }

        if (!rawBody.includes("X-WARMUP-ID:")) {
          console.log("      ⏩ Skipped: missing X-WARMUP-ID");
          await connection.addFlags(msg.attributes.uid, "\\Seen");
          continue;
        }

        const match = fromHeader.match(/<([^>]+)>/);
        const senderEmail = match ? match[1] : fromHeader;

        if (senderEmail === inbox) {
          console.log("      🔁 Skipped: self‑sent");
          await connection.addFlags(msg.attributes.uid, "\\Seen");
          continue;
        }
        // ✅ Reply
        console.log(`      📬 Replying to ${senderEmail}...`);

        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: inbox, pass: appPassword },
          });
          await transporter.sendMail({
            from: `"Warmup Bot" <${inbox}>`,
            to: senderEmail,
            subject: `RE: ${subject}`,
            text: "Thanks for your warmup email! This is an automated reply. No action needed.",
          });
          const user = await User.findOne({ "warmupInboxes.inbox": senderEmail });

          if (!user) {
            console.warn(`⚠️ user not found for inbox ${senderEmail}`);
            return;
          }
          
          // Find the specific inbox inside the user's warmupInboxes array
          const inboxEntry = user.warmupInboxes.find(
            (i) => i.inbox.toLowerCase() === senderEmail.toLowerCase()
          );
          
          if (!inboxEntry) {
            console.warn(`⚠️ Inbox entry not found`);
            return;
          }
          
          inboxEntry.totalInboxHit += 1;
          
          await user.save();
          console.log("      ✅ Reply sent");
        } catch (err) {
          console.error("      ❌ Reply failed:", err.message);
        }

        await connection.addFlags(msg.attributes.uid, "\\Seen");
        console.log("      👁 Marked as seen");
      }

      connection.end();
      console.log(`   ✔ Finished ${inbox}`);
    }
  }
  console.log("\n🏁 Auto‑reply cycle complete.");
  isRunning = false;
}

if (require.main === module) {
  startAutoReplier().catch(err => {
    console.error("🔥 Fatal error:", err);
  });
}

module.exports = { startAutoReplier };
