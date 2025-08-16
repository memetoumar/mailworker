const amqplib = require('amqplib/callback_api');
const nodemailer= require('nodemailer')
const {receivedmails} =require("./receivedEmails")

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
                    channel.prefetch(10);
          
                    // Set up callback to handle messages received from the queue
                    let sended= [];
                    let checker;
                    channel.consume(amqp.queue, data => {
                        if (data==null) {
                            return;
                        }
          
                        // Decode message contents
                        let message = JSON.parse(data.content.toString());
          
                        // attach message specific authentication options
                        // this is needed if you want to send different messages from
                        // different user accounts
                        // message.auth = {
                        //     user: 'testuser',
                        //     pass: 'testpass'
                        // };
                        // let list =["bok <dangabarin2020@gmail.com>","bulama<dangabarin2020@gmail.com>","bok <dangabarin2020@gmail.com>","chexa <dangabarin2020@gmail.com>","malo <dangabarin2020@gmail.com>","<muhammad <dangabarin2020@gmail.com>","musa <dangabarin2021@gmail.com>","garba <dangabarin2021@gmail.com>","hassan <dangabarin2021@gmail.com>","abdul <dangabarin2021@gmail.com>"]
                       
                         
   console.log(checker);
                    
                        const mail_config={
                          from: message.from, // sender address
                          to: message.to, // list of receivers
                          subject: message.subject, // Subject line
                          replyTo:message.replyTo,
                        //    text: message.text, // plain text body
                          html:message.html ,// html body,    
                        }
                    
                       // Send the message using the previously set up Nodemailer transport
                       transport.sendMail(mail_config, (err, info) => {
                        if (err) {
                            console.error(err.stack);
                            // put the failed message item back to queue
                             channel.nack(data);
                        }
                        sended.push(message.to)
                        console.log("processed",sended);
                        console.log('Delivered message %s', info);
                        channel.ack(data);
                         if(checker==0){
                            // checker=null;
                            //  channel.close()
                           channel.close(() => connection.close());
                 return res.status(200).json({msg:sended})
                         }
                      
                        // remove message item from the queue
                    })

                    channel.checkQueue(amqp.queue,(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            // if(data.messageCount==0){
                                checker= data.messageCount
                                // return console.log(checker)
                    
                            // }
                        } 
                       })
                     
                    

                        
                        // return process.exit(0);
      
                  
                    });
                });
            });
          });
        
    
}
module.exports= {rabbitconsumer}