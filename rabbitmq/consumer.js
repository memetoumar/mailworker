const amqplib = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
// const { convert } = require('html-to-text');

// 🔐 Your pool of warmed inboxes
const mailboxes = [
  { user: "dangabarin2020@gmail.com", pass: "bzsxkowyjanzxyjo" },
  { user: "memetsamples@gmail.com", pass: "bhihurizjmhmyfsl" },
  { user: "memetoumar@gmail.com", pass: "dfbbiugrxpcivjkh" },
];

let currentMailboxIndex = 0;
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
const getNextTransport = () => {
  const { user, pass } = mailboxes[currentMailboxIndex];
  currentMailboxIndex = (currentMailboxIndex + 1) % mailboxes.length;

  console.log(`🔄 Using mailbox: ${user}`);
  return {
    transport: nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    }),
    sender: user,
  };
};
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

        const { transport, sender } = getNextTransport();
        const text = message.text || '';
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
  
 sleep(30000 + Math.random() * 30000).then(()=>{
  transport.sendMail(mail_config, (err, info) => {
          if (err) {
            console.error(`❌ Send Error to ${message.to}:`, err.message);
            return channel.ack(data);
          }
        
          // console.log(`✅ Senthhhhhhhhhhhv vvvvvv to: ${message.to}`);
          console.log(` Sent to: ${message.to}`);
          

          sentTo.push(message.to);

          // ✅ PUBLISH to sentLogs queue
          if (message.userId) {
            const log = {
              userId: message.userId,
              email: message.to
            };
            console.log("📤 Publishing to sentLogs", log);

            channel.sendToQueue("sentLogs", Buffer.from(JSON.stringify(log)), {
              persistent: true
            });
            
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

module.exports = { campaignConsumer };
