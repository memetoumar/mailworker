const amqplib = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');

// 🔐 Your pool of warmed inboxes
const mailboxes = [
  {
    user: "dangabarin2020@gmail.com",
    pass: "yabccxpsciuoynqs",
  },
  {
    user: "memetsamples@gmail.com",
    pass: "bhihurizjmhmyfsl",
  },
  {
    user: "memetoumar@gmail.com",
    pass: "dfbbiugrxpcivjkh",
  },
];

let currentMailboxIndex = 0;

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

// 📨 Main Consumer
const rabbitconsumer = (amqp, res, list) => {
  amqplib.connect(amqp.amqp, (err, connection) => {
    if (err) {
      console.error("❌ AMQP Connection Error:", err.stack);
      return process.exit(1);
    }

    connection.createChannel((err, channel) => {
      if (err) {
        console.error("❌ Channel Error:", err.stack);
        return process.exit(1);
      }

      channel.assertQueue(amqp.queue, { durable: true }, err => {
        if (err) {
          console.error("❌ Queue Error:", err.stack);
          return process.exit(1);
        }

        channel.prefetch(1);
        const sentTo = [];
        let summaryTimer = null;
        // this is gonna send a brief about the emails queued and sent to my email account
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
                if (err) {
                  console.error("❌ Summary Email Error:", err.stack);
                } else {
                  console.log("📬 Summary email sent.");
                }
                sentTo.length = 0;
              });
            }
          }, 5000); // wait 5s of inactivity
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

          // Fallback plain text extraction
          const text = convert(message.html || message.text || '', {
            wordwrap: false,
            selectors: [
              { selector: 'img', format: 'skip' },
              { selector: 'style', format: 'skip' }
            ]
          });

         const fromName = message.from && message.from.trim() ? message.from.trim() : 'memet oumar';
          
         const mail_config = {
            from: `${fromName} <${sender}>`,
            to: message.to,
            subject: message.subject || "No subject",
            replyTo: sender,
            text,
            headers: {
              'X-Priority': '3',
              'X-Mailer': 'Nodemailer',
              // 'List-Unsubscribe': `<mailto:${sender}>`,
            }
          };

          // Optional: send HTML only if exists
          if (message.html && message.html.trim() && message.sendHTML =='true') {
            mail_config.html = message.html;
          }

          console.log(`📤 Sending email to ${message.to}...`);

          transport.sendMail(mail_config, (err, info) => {
            if (err) {
              console.error(`❌ Send Error to ${message.to}:`, err.message);
              return channel.ack(data); // ✅ still ack to avoid retry loops
            }

            console.log(`✅ Sent to: ${message.to}`);
            sentTo.push(message.to);
            channel.ack(data);
            scheduleSummary(sender, transport); // ⏱️ restart summary timer
          });
        });
      });
    });
  });
};

module.exports = { rabbitconsumer };
