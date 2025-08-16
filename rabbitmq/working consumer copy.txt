const amqplib = require('amqplib/callback_api');
const nodemailer= require('nodemailer')

const rabbitconsumer=(amqp,res,config,list)=>{
  let transport =nodemailer.createTransport(config)

     amqplib.connect(amqp.amqp, (err, connection) => {
    
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }
            // Create channel
            connection.createChannel((err, channel) => {
                if (err) {
                    console.error(err.stack);
                    return process.exit(1);
                }
          
                // Ensure queue for messages
                channel.assertQueue(amqp.queue, {
                    // Ensure that the queue is not deleted when server restarts
                    durable: true
                }, err => {
                    if (err) {
                        console.error(err.stack);
                        return process.exit(1);
                    }
          
                    // Only request 1 unacked message from queue
                    // This value indicates how many messages we want to process in parallel
                    channel.prefetch(1);
          
                    // Set up callback to handle messages received from the queue
                    let sentTo= [];
                  const processed = new Set();
                    channel.consume(amqp.queue, data => {
                        const message = JSON.parse(data.content.toString());
                        if (data==null) {
                            return;
                        }

                if (processed.has(message.id)) {
                    console.log("Skipping duplicate:", message.id);
                    return channel.ack(data); // prevent infinite loop
                }
                processed.add(message.id);
                // Optional: clear old IDs after N mins
                        // Decode message contents
          
                        // attach message specific authentication options
                        // this is needed if you want to send different messages from
                        // different user accounts
                        // message.auth = {
                        //     user: 'testuser',
                        //     pass: 'testpass'
                        // };
                        // let list =["bok <dangabarin2020@gmail.com>","bulama<dangabarin2020@gmail.com>","bok <dangabarin2020@gmail.com>","chexa <dangabarin2020@gmail.com>","malo <dangabarin2020@gmail.com>","<muhammad <dangabarin2020@gmail.com>","musa <dangabarin2021@gmail.com>","garba <dangabarin2021@gmail.com>","hassan <dangabarin2021@gmail.com>","abdul <dangabarin2021@gmail.com>"]
                    
                        const mail_config={
                          from: message.from, // sender address
                          to: message.to, // list of receivers
                          subject: message.subject, // Subject line
                          replyTo:message.replyTo,
                          //   html:message.html ,// html body,    
                           text: message.text, 
                            headers: {
                            'X-Priority': '3', // 1 = High, 3 = Normal
                            'X-Mailer': 'Nodemailer', // Info about the sender app
                            'List-Unsubscribe': '<mailto:dangabarin2020@gmail.com>', // Optional, but good for mass mail
                            }
                        }
                    
                       // Send the message using the previously set up Nodemailer transport
                       transport.sendMail(mail_config, (err, info) => {
                        if (err) {
                            console.error(err.stack);
                            if(mail_config.to =='' || message.to ==' ' ){
                             channel.ack(data);
                            }
                            // put the failed message item back to queue
                             channel.nack(data);
                        }
                        sentTo.push(message.to)
                        console.log("processed emails",sentTo);
                        channel.ack(data);
                        // console.log('Delivered message %s', info);
                        //    channel.close(() => connection.close());
                        //    channel.deleteQueue(amqp.queue,{ifEmpty:true})
                    })

                    channel.checkQueue(amqp.queue,(err,data)=>{
                        if(err){
                            console.log(`error checking queue >>> ${err}`);
                            return process.exit(0);
                        }else{
                        // console.log(`remaining queues left :${data.messageCount}`)

                            // when queue is totally absorbed
                            if(data.messageCount==0){
                                console.log(`queues absorbed totally !!!`)
                           const mail_conf = {
                                from: '"Processed Messages" <dangabarin2020@gmail.com>', // ✅ valid sender
                                to: "dangabarin2020@gmail.com",
                                subject: "Emails Processed",
                                replyTo: "dangabarin2020@gmail.com",
                                text: `Hello Memet,\n\nthe total of ${sentTo.length} email contacts have received our messages:\n\n${sentTo.join('\n')}`
                            };
                                // send this mail to the sender of the bulk email about the inboxes that received the emails
                                  return transport.sendMail(mail_conf, (err, info) => {
                                  if (err) {console.error(err.stack);}
                                  console.log('message absorbed successfully')
                                  sentTo=[]
                                   })
                            }
                        } 
                       })
                     
                    

                        
                        // return process.exit(0);
      
                  
                    });
                });
            });
          });
        
    
}
module.exports= {rabbitconsumer}