// }
// 👥 Found 1 user(s)
// Terminate batch job (Y/N)? y
// PS C:\Users\user\Desktop\worker> npm start

// > backend@1.0.0 start
// > node worker.js

// connected successfully...
// 🕓 Warmup auto-reply worker started...
// 🚀 Starting auto‑replier...
// 👥 Found 1 user(s)
// ✅ RabbitMQ connected & queue asserted
// 🕓 Scheduler started
// 🚀 Email worker started with concurrency: 1
// ⏩ Skipping memetsamples@gmail.com because it is a listener-only inbox

// 📥 Checking inbox: memetsamples@gmail.com
//    🔍 Searching for UNSEEN since 2025-08-05T14:41:46.634Z...
// ✅ Email sent from dangabarin2020@gmail.com ➡️ memetoumar@gmail.com, scheduled time is at null
// ⏩ Skipping memetoumar@gmail.com because it is a listener-only inbox
//       👀 Skipped: might be commercial email, so did not open (realistic behavior)
//       👀 Skipped: might be commercial email, so did not open (realistic behavior)
// ✅ Email sent from dangabarin2020@gmail.com ➡️ memetoumar@gmail.com, scheduled time is at null
//       👀 Skipped: might be commercial email, so did not open (realistic behavior)
//    ✔ Finished memetsamples@gmail.com
// fresh day started, scheduling all cold warm up emails started
// ⏩ Scheduling 9 for dangabarin2020@gmail.com
// ✅ Email sent from dangabarin2020@gmail.com ➡️ memetsamples@gmail.com, scheduled time is at null

// 📥 Checking inbox: memetoumar@gmail.com
// ✅ Email sent from dangabarin2020@gmail.com ➡️ memetoumar@gmail.com, scheduled time is at null
//    🔍 Searching for UNSEEN since 2025-08-05T14:23:11.006Z...
//       🗨️ Skipped: replyRate throttle (opened but no reply)
//       ❗ Marked as important
//       📬 Replying to dangabarin2020@gmail.com...
//       ✅ Reply sent & inbox stats updated
// C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:1502
//     err = new Error(errtext);
//           ^

// Error: Invalid Arguments: Unable to parse flag \Important
//     at Connection._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:1502:11)
//     at Parser.<anonymous> (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:194:10)
//     at Parser.emit (node:events:519:28)
//     at Parser._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:175:10)
//     at Parser._parse (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:139:16)
//     at Parser._tryread (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:82:15)
//     at Parser._cbReadable (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:53:12)
//     at TLSSocket.emit (node:events:519:28)
//       📬 Replying to dangabarin2020@gmail.com...
//       ✅ Reply sent & inbox stats updated
// C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:1502
//     err = new Error(errtext);
//           ^

// Error: Invalid Arguments: Unable to parse flag \Important
//     at Connection._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:1502:11)
//     at Parser.<anonymous> (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:194:10)
//     at Parser.emit (node:events:519:28)
//     at Parser._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:175:10)
//     at Parser._parse (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:139:16)
//     at Parser._tryread (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:82:15)
//     at Parser._cbReadable (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:53:12)
//     at TLSSocket.emit (node:events:519:28)
//       ✅ Reply sent & inbox stats updated
// C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:1502
//     err = new Error(errtext);
//           ^

// Error: Invalid Arguments: Unable to parse flag \Important
//     at Connection._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:1502:11)
//     at Parser.<anonymous> (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:194:10)
//     at Parser.emit (node:events:519:28)
//     at Parser._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:175:10)
//     at Parser._parse (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:139:16)
//     at Parser._tryread (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:82:15)
//     at Parser._cbReadable (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:53:12)
//     at TLSSocket.emit (node:events:519:28)
// Error: Invalid Arguments: Unable to parse flag \Important
//     at Connection._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:1502:11)
//     at Parser.<anonymous> (C:\Users\user\Desktop\worker\node_modules\imap\lib\Connection.js:194:10)
//     at Parser.emit (node:events:519:28)
//     at Parser._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:175:10)
//     at Parser._parse (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:139:16)
//     at Parser._tryread (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:82:15)
//     at Parser._cbReadable (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:53:12)
//     at TLSSocket.emit (node:events:519:28)
//     at Parser.emit (node:events:519:28)
//     at Parser._resTagged (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:175:10)
//     at Parser._parse (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:139:16)
//     at Parser._tryread (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:82:15)
//     at Parser._cbReadable (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:53:12)
//     at TLSSocket.emit (node:events:519:28)
//     at Parser._parse (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:139:16)
//     at Parser._tryread (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:82:15)
//     at Parser._cbReadable (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:53:12)
//     at TLSSocket.emit (node:events:519:28)
//     at Parser._cbReadable (C:\Users\user\Desktop\worker\node_modules\imap\lib\Parser.js:53:12)
//     at TLSSocket.emit (node:events:519:28)
//     at emitReadable_ (node:internal/streams/readable:832:12)
//     at emitReadable_ (node:internal/streams/readable:832:12)
//     at process.processTicksAndRejections (node:internal/process/task_queues:81:21) {
//   type: 'bad',
//     at process.processTicksAndRejections (node:internal/process/task_queues:81:21) {
//   type: 'bad',
//   textCode: undefined,
//   type: 'bad',
//   textCode: undefined,
//   textCode: undefined,
//   source: 'protocol'
// }

// Node.js v20.15.0
// PS C:\Users\user\Desktop\worker> ^C
// PS C:\Users\user\Desktop\worker>














