const amqplib = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');



// Step 1: Define your pool of warmed inboxes
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
  // Add more inboxes here
];

let currentMailboxIndex = 0;

// Step 2: Rotate transport per message
const getNextTransport = () => {
  const { user, pass } = mailboxes[currentMailboxIndex];
  const usedIndex = currentMailboxIndex;
  currentMailboxIndex = (currentMailboxIndex + 1) % mailboxes.length;

  console.log(`🔄 Using mailbox: ${mailboxes[usedIndex].user}`);

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


// Main consumer
const rabbitconsumer = (amqp, res, list) => {
  amqplib.connect(amqp.amqp, (err, connection) => {
    if (err) {
      console.error("Connection error:", err.stack);
      return process.exit(1);
    }

    connection.createChannel((err, channel) => {
      if (err) {
        console.error("Channel error:", err.stack);
        return process.exit(1);
      }

      channel.assertQueue(amqp.queue, { durable: true }, err => {
        if (err) {
          console.error("Queue error:", err.stack);
          return process.exit(1);
        }

        channel.prefetch(1);
        const sentTo = [];
        const processed = new Set();

        channel.consume(amqp.queue, data => {
          if (!data) return;

          const message = JSON.parse(data.content.toString());

          if (processed.has(message.id)) {
            console.log("Skipping duplicate:", message.id);
            return channel.ack(data);
          }
          processed.add(message.id);

          const { transport, sender } = getNextTransport();
     const text= convert(message.html || '', {
  wordwrap: false, // Don't insert hard line breaks
  selectors: [
    { selector: 'img', format: 'skip' }, // skip invisible tracking images
    { selector: 'style', format: 'skip' }, // this removes CSS
  ]
});
         const mail_config = {
            from: sender,
            to: message.to,
            subject: message.subject,
            replyTo: sender,
            // Then in mail_config:
           text,
           headers: {
              'X-Priority': '3',
              'X-Mailer': 'Nodemailer',
              'List-Unsubscribe': `<mailto:${sender}>`,
            },
          };
          // console.log(text)
          // Only add the HTML version if it's not empty/null/undefined
            if (message.html && message.html.trim() !== "") {
            mail_config.html = message.html;
          }

          transport.sendMail(mail_config, (err, info) => {
            if (err) {
              console.error("SendMail Error:", err.stack);
              if (!message.to || message.to.trim() === '') {
                return channel.ack(data);
              }
              return channel.nack(data);
            }

            sentTo.push(message.to);
            console.log("Sent to:", message.to);
            channel.ack(data);

            // Check if queue is empty
            channel.checkQueue(amqp.queue, (err, qData) => {
              if (err) {
                console.log("Queue check error:", err);
                return;
              }

              if (qData.messageCount === 0 && sentTo.length > 0) {
                const summaryMail = {
                  from: sender,
                  to: sender,
                  subject: "Emails Processed",
                  replyTo: sender,
                  text: `✅ ${sentTo.length} emails were sent:\n\n${sentTo.join('\n')}`,
                };

                transport.sendMail(summaryMail, (err, info) => {
                  if (err) console.error("Summary Mail Error:", err.stack);
                  else console.log("All messages processed and summary sent.");
                  sentTo.length = 0; // Reset
                });
              }
            });
          });
        });
      });
    });
  });
};

module.exports = { rabbitconsumer };
