const amqplib = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const User = require("../model/userAuth");
// const { convert } = require('html-to-text');

// 🔐 Your pool of warmed inboxes
const mailboxesww = [
  { user: "dangabarin2020@gmail.com", pass: "bzsxkowyjanzxyjo" },
  { user: "memetsamples@gmail.com", pass: "bhihurizjmhmyfsl" },
  { user: "memetoumar@gmail.com", pass: "dfbbiugrxpcivjkh" },
];

let mailboxes = [];
let currentMailboxIndex = 0;

async function loadMailboxes() {
  const users = await User.find(
    {
      "warmupInboxes.status": "active",
    },
    {
      warmupInboxes: 1
    }
  ).lean();

  const activeMailboxes = [];

  for (const user of users) {
    for (const inboxCfg of user.warmupInboxes) {
      if (
        inboxCfg.status !== "active" ||
        inboxCfg.canSendCampaign !== true
      ) {
        continue;
      }

      activeMailboxes.push({
        userId: user._id,
        inboxId: inboxCfg._id,
        user: inboxCfg.inbox,
        pass: inboxCfg.appPassword,
        firstName: inboxCfg.firstName,
        dailyLimit: inboxCfg.dailyLimit,
        sentToday: inboxCfg.sentToday,
        reservedToday: inboxCfg.reservedToday || 0,
        status: inboxCfg.status,
        canSendCampaign: inboxCfg.canSendCampaign
      });
    }
  }

  mailboxes = activeMailboxes;

  console.log(`📬 Loaded ${mailboxes.length} campaign-enabled inboxes`);
}
let transports = [];

function initializeTransports() {
  transports = mailboxes.map((mailbox) => ({
    sender: mailbox.user,
    firstName: mailbox.firstName,
    userId: mailbox.userId,
    // NEW
    inboxId: mailbox.inboxId,
    transport: nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailbox.user,
        pass: mailbox.pass
      }
    })
  }));

  console.log(`📨 Initialized ${transports.length} SMTP transporters`);
}
function spinText(text) {
  if (!text) return '';

  return text.replace(/\{([^{}]+)\}/g, (match, choices) => {
    const options = choices
      .split('|')
      .map(option => option.trim())
      .filter(Boolean);

    return options[Math.floor(Math.random() * options.length)];
  });
}
function getNextTransport() {
  if (transports.length === 0) {
    throw new Error("No active mailboxes available");
  }

  const account = transports[currentMailboxIndex];

  currentMailboxIndex =
    (currentMailboxIndex + 1) % transports.length;

  console.log(`🔄 Using mailbox: ${account.sender}`);

  return account;
}
  function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
// 📨 Main Consumer
const campaignConsumer = (amqp, res, list) => {
  amqplib.connect(amqp.amqp, (err, connection) => {
    if (err) {
      console.error("❌ AMQP Connection Error:", err.stack);
      return process.exit(1);
    }
  //  console.log("amqp connected successfully")
    connection.createChannel((err, channel) => {
      if (err) {
        console.error("❌ Channel Error:", err.stack);
        return process.exit(1);
      }

      // 🔔 Set up the main email queue and the sentLogs queue
      channel.assertQueue(amqp.queue, { durable: true });
      channel.assertQueue("sentLogs", { durable: true }); // 👈 ADDED

      channel.prefetch(1);
      const sentTo = [];
      let summaryTimer = null;

      const scheduleSummary = (sender, transport) => {
        clearTimeout(summaryTimer);
        summaryTimer = setTimeout(() => {
          if (sentTo.length > 0) {
            const summaryMail = {
              from: sender,
              to: "dangabarin2020@gmail.com",
              subject: "✅ Email Sent Summary",
              replyTo: sender,
              text: `✅ ${sentTo.length} emails were sent:\n\n${sentTo.join('\n')}`,
            };
            transport.sendMail(summaryMail, (err) => {
              if (err) console.error("❌ Summary Email Error:", err.stack);
              else console.log("📬 Summary email sent.");
              sentTo.length = 0;
            });
          }
        }, 80000);
      };

      channel.consume(amqp.queue, data => {
        if (!data) return;

        let message;
        try {
          message = JSON.parse(data.content.toString());
        } catch (e) {
          console.error("❌ Invalid message format.");
          return channel.ack(data);
        }

        if (!message.to || message.to.trim() === "") {
          console.warn("⚠️ Skipping empty 'to' address.");
          return channel.ack(data);
        }

        const { transport, sender, inboxId } = getNextTransport();
        const text = message.plainText || '';
        const fromName = message.from && message.from.trim() ? message.from.trim() : 'memet oumar';

        const mail_config = {
          from: `${fromName} <${sender}>`,
          to: message.to,
          subject: spinText(message.subject || "No subject"),
          text: spinText(text),
          replyTo: sender,
          headers: {
            'X-Priority': '3',
            'X-Mailer': 'Nodemailer',
          }
        };

        if (message.html && message.html.trim() && message.sendHTML === true) {
          mail_config.html = message.html
        }

        console.log(`📤 Sending email to ${message.to}...`);
  // sleep(30000 + Math.random() * 30000).
 sleep(5000 + Math.random() * 8000).then(()=>{
  transport.sendMail(mail_config, (err, info) => {
          if (err) {
            console.error(`❌ Send Error to ${message.to}:`, err.message);
            return channel.ack(data);
          }

          console.log(` Sent to: ${message.to}`);
          sentTo.push(message.to);

          // ✅ PUBLISH to sentLogs queue
        if (message.userId) {
  const log = {
    userId: message.userId,
    trackerId: message.trackerId,
    contactEmail: message.contactEmail || message.to,

    // Which mailbox actually sent this email
    mailboxId: inboxId,
    sender,

    // VERY IMPORTANT
    messageId: info.messageId,

    subject: mail_config.subject,
    sentAt: new Date()
  };

  console.log("📤 Publishing to sentLogs", log);

  channel.sendToQueue(
    "sentLogs",
    Buffer.from(JSON.stringify(log)),
    {
      persistent: true,
      contentType: "application/json"
    }
  );
}

          channel.ack(data);
          scheduleSummary(sender, transport);
        });
 }).catch(err => {
  console.error("❌ Sleep error:", err);
  channel.ack(data);
});;
        
      });
    });
  });
};

async function startCampaignWorker(amqp) {
  try {
    await loadMailboxes();

    initializeTransports();

    campaignConsumer(amqp);

  } catch (error) {
    console.error(
      "❌ Failed to start campaign worker:",
      error
    );
  }
}
module.exports = {
  startCampaignWorker
};
