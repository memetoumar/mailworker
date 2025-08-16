const nodemailer=require("nodemailer");
const schedule = require('node-schedule');
const Imap = require('imap');
const { simpleParser } = require('mailparser');

// Function to check bounces

async function checkBounces() {
    const imap = new Imap({
        user: 'dangabarin2020@gmail.com',
        password: 'mimihaha',
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });
  
    function openInbox(cb) {
        imap.openBox('INBOX', false, cb);
    }

    imap.once('ready', function () { 
        openInbox(function (err, box) {
            if (err) throw err;
            imap.search(['UNSEEN'], function (err, results) {
                if (err) throw err;
                const f = imap.fetch(results, { bodies: '' });

                f.on('message', function (msg, seqno) {
                    msg.on('body', function (stream, info) {
                        simpleParser(stream, async (err, mail) => {
                            if (err) throw err;
                            console.log('Parsed email:', mail);

                            // Check if the email is a bounce notification
                            if (mail.subject && mail.subject.includes('Undelivered Mail Returned to Sender')) {
                                // Extract the bounced email address from the message
                                const bouncedEmail = extractBouncedEmail(mail.text);

                                // Store the bounced email in MongoDB
                                await storeBouncedEmail(bouncedEmail);
                            }
                        });
                    });
                });

                f.once('error', function (err) {
                    console.log('Fetch error: ' + err);
                });

                f.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', function (err) {
        console.log(err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();
}

function extractBouncedEmail(emailText) {
    // Extract bounced email address from the email text
    const match = emailText.match(/(?:Final-Recipient: rfc822;)([^\s]+)/);
    return match ? match[1] : null;
}

async function storeBouncedEmail(bouncedEmail) {
    if (!bouncedEmail) return;
    

  conole.log("yayi")
}

// Schedule the job to run every hour using a human-readable interval
schedule.scheduleJob('0 * * * *', checkBounces);