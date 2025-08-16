 try {
        // IMAP config
        const connection = await imaps.connect({
          imap: {
            user: inbox,
            password: appPassword,
            host:    "imap.gmail.com",
            port:     993,
            tls:     true,
            tlsOptions: { rejectUnauthorized: false },
            authTimeout: 30000
          }
        });

        // Open INBOX
        await connection.openBox("INBOX");

        // Search unseen messages
        const unseen = await connection.search(
          ["UNSEEN"],
          {
            bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", ""], // raw + header
            struct: true,
            markSeen: false
          }
        );
        console.log(`📨 ${inbox}: found ${unseen.length} unseen email(s)`);

        for (const msg of unseen) {
          // Extract raw body (which === "")
          const part = msg.parts.find(p => p.which === "");
          if (!part || !part.body) continue;

          // Parse full message
          const parsed = await simpleParser(part.body);
          const { from, subject, text } = parsed;
          const senderEmail = from?.value?.[0]?.address || "";

          console.log("🔍 Inspecting:", {
            inbox,
            from:  senderEmail,
            subject,
            snippet: (text || "").slice(0, 60).replace(/\n/g, " ")
          });

          // FILTERS: only warmup emails
          if (!subject?.startsWith("[Warmup]")) {
            console.log("⏩ Skipped: subject not warmup");
            continue;
          }
          if (!text.includes("X-WARMUP-ID:")) {
            console.log("⏩ Skipped: missing X-WARMUP-ID");
            continue;
          }
          if (senderEmail === inbox) {
            console.log("🔁 Skipped: self‑sent");
            continue;
          }

          // SEND auto‑reply
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: inbox, pass: appPassword },
          });

          await transporter.sendMail({
            from:    `"Warmup Bot" <${inbox}>`,
            to:       senderEmail,
            subject: `RE: ${subject}`,
            text:    "Thanks for your warmup email! This is an automated reply. No action needed.",
          });

          console.log(`✉️ Replied from ${inbox} to ${senderEmail}`);

          // MARK seen
          const uid = msg.attributes.uid;
          connection.addFlags(uid, "\\Seen", () => {});
        }

        await connection.end();
        console.log(`✅ Done checking ${inbox}\n`);
      } catch (err) {
        console.error(`❌ ${inbox} error:`, err.message);
      }














       // rabbitmq/autoReplier.js
const Imap = require("imap-simple");
const nodemailer = require("nodemailer");
const User = require("../model/userAuth");

require("dotenv").config();

async function startAutoReplier() {
  const users = await User.find({ "warmupInboxes.status": "active" });

  for (const user of users) {
    for (const inbox of user.warmupInboxes) {
      if (inbox.status !== "active") continue;

      try {
        const config = {
          imap: {
            user: inbox.inbox,
            password: inbox.appPassword,
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }, // Accept self-signed certs
            authTimeout: 10000,
          },
        };

        const connection = await Imap.connect(config);
        await connection.openBox("INBOX");

        const searchCriteria = [["UNSEEN"]];
        const fetchOptions = { bodies: ["HEADER.FIELDS (FROM SUBJECT)"], markSeen: false };
        const results = await connection.search(searchCriteria, fetchOptions);

        for (const item of results) {
          const header = item.parts.find(part => part.which === "HEADER.FIELDS (FROM SUBJECT)");
          const from = header?.body.from?.[0] || "";
          const subject = header?.body.subject?.[0] || "";

          if (!from || !subject) {
            console.log("⏩ Skipping email from undefined with subject \"\"");
            continue;
          }

          const fromEmailMatch = from.match(/<([^>]+)>/);
          const senderEmail = fromEmailMatch ? fromEmailMatch[1] : from;

          if (senderEmail === inbox.inbox) {
            // Don't reply to self
            continue;
          }

          const replyTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: inbox.inbox,
              pass: inbox.appPassword,
            },
          });

         
           await transporter.sendMail({
            from:    `"Warmup Bot" <${inbox}>`,
            to:       senderEmail,
            subject: `RE: ${subject}`,
            text:    "Thanks for your warmup email! This is an automated reply. No action needed.",
          });

             console.log(`✉️ Replied from ${inbox} to ${senderEmail}`);

          // Mark email as seen to avoid double replies
          const uid = item.attributes.uid;
          connection.addFlags(uid, ["\\Seen"], () => {});
        }

        await connection.end();
      } catch (err) {
        console.error(`❌ Error processing inbox ${inbox.inbox}:`,err.message);
      }
    }
  }

  console.log("✅ Auto-reply cycle complete.");
}

module.exports = { startAutoReplier };