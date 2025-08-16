const express= require("express");
const app= express();
const cors=require("cors");


require("dotenv").config();

const {connectDb}=require("./db/connectDb");
const auth=require("./routes/createUser");
const trackEmail=require("./routes/trackEmaill");
const subscriber=require("./routes/subscriber");
const template=require("./routes/template");
const segment=require("./routes/segment");
const groups=require("./routes/groups");
const fields=require("./routes/fields");
const publish=require("./routes/publish");
const mail=require("./routes/mail");
const campaign=require("./routes/campaign");
const preview=require("./routes/preview");
// const React = require('react');
// const ReactDOMServer = require('react-dom/server');
// const path = require('path');

// require('@babel/register')({
//     presets: ['@babel/preset-env', '@babel/preset-react']
//   });
//   const MyComponent = require('./Component.jsx').default;
//   const component = React.createElement(MyComponent, { name });
//   const html = ReactDOMServer.renderToString(component);

const port= process.env.PORT||5000;
app.use(express.json({limit:"20mb"})) 
app.use(cors())
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
  }) 
app.use("/api/v1/auth",auth)
app.use("/api/v1/track",trackEmail)
app.use("/api/v1/subscriber",subscriber)
app.use("/api/v1/template",template)
app.use("/api/v1/publish",publish) 
app.use("/api/v1/segment",segment)
app.use("/api/v1/groups",groups)
app.use("/api/v1/fields",fields)
app.use("/api/v1/mail",mail);
app.use("/api/v1/campaign",campaign);
app.use("/preview-inboxified.com",preview);
 



// schedule.scheduleJob('* * * * * *', checkBounces);
     
app.get("/",(req,res)=>{
    res.send(`<p>server up and running...</p>`)
     })
  
//   rabbitProvider(config)
    

       
//    })
 
// offline server
// var transport =nodemailer.createTransport({
//     service:"gmail",
//     port:587,
//     auth:{
//         user:'dangabarin2020@gmail.com',
//         pass:"ohsdkshebmmfrzsb"
//     },
   
// });
    // const mail_config={
    //     // khalifah="mhhammadrufai49@gmail.com"
    //     from: ` mome <dangabarin2020@gmail.com>`, // sender address
    //     // to: "dangabarin2020@gmail.com,services.1017mail@contractor.net,dangabarin2020@outlook.com", // list of receivers
    //     to, // list of receivers
    //     // bcc: "Send2usi@gmail.com,aiahmaddeen@gmail.com,dangabarin2020@gmail.com,dangabarin2021@gmail.com", // list of receivers
    //     // Bcc: "dangabarin2020@gmail.com,dangabarin2021@gmail.com, baz@example.com", // list of receivers
    //     subject, // Subject line
    //     replyTo:"dangabarin2020@gmail.com",
    //      // text: `Hello its   from 1017mail`, // plain text body
    //     html:req.body.ht ,// html body,

        
    //   }
// app.listen(port,()=>{
//     console.log(`port ${port} steady and grinding...`)
// })
// console.log(process.env.CONNECTDB);


const startServer=async()=>{
try {
    await connectDb(process.env.MONGODB_URI).then(()=>{
        console.log("connected successfully...");
    })
    app.listen(port,()=>{
        console.log(`port ${port} staedy and grinding...`)
    })
} catch (error) {  
    console.log(`connection to mongo failed ${error}`)  
}  
}
startServer() 