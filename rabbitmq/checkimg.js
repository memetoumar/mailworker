const amqplib = require('amqplib/callback_api');
const rabbitProvider=(amqp,res,options)=>{
  return  new Promise((resolve, reject) => {
        
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
          
                    // Create a function to send objects to the queue
                    // Javascript object is converted to JSON and then into a Buffer
                    let sender = (content, next) => {
                        let sent = channel.sendToQueue(amqp.queue, Buffer.from(JSON.stringify(content)), {
                            // Store queued elements on disk
                            persistent: true,
                            contentType: 'application/json'
                        });
                        if (sent) {
                            return next();
                        } else {
                            channel.once('drain', () => next());
                        }
                    };
          
                    // push 100 messages to queue
                    let sent=0;
                    let list =["bok <dangabarin2020@gmail.com>","bulama<dangabarin2020@gmail.com>","bok <dangabarin2020@gmail.com>","chexa <dangabarin2020@gmail.com>","malo <dangabarin2020@gmail.com>","<muhammad <dangabarin2020@gmail.com>","musa <dangabarin2021@gmail.com>","garba <dangabarin2021@gmail.com>","hassan <dangabarin2021@gmail.com>","abdul <dangabarin2021@gmail.com>"]
                  console.log(options);
                    let sendNext = () => {
                        if (sent >=options.list.length) {
                        // if (sent >=6) {
                        
                            // res.status(200).json({msg:"all messages are processed...."})
                            // Close connection to AMQP server
                            // We need to call channel.close first, otherwise pending
                            // messages are not written to the queue
                            // console.log(sent);
                            console.log('All messages sent!');
                           resolve('All messages sent!');
                              return channel.close(() => connection.close());
                        }
                            sent++;                
                            sender({
                                from :'template builder testing <d@example.com>',
                                to:options.list[sent-1],
                                replyTo:"dangabarin2020@gmail.com",
                                subject: options.subject + sent,
                                text: 'hello world!',
                                html:`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                                <head>
                                    <!--[if gte mso 9]>
                                    <xml>
                                        <o:OfficeDocumentSettings>
                                        <o:AllowPNG/>
                                        <o:PixelsPerInch>96</o:PixelsPerInch>
                                        </o:OfficeDocumentSettings>
                                    </xml>
                                    <![endif]-->
                                    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                    <meta name="format-detection" content="date=no" />
                                    <meta name="format-detection" content="address=no" />
                                    <meta name="format-detection" content="telephone=no" />
                                    <meta name="x-apple-disable-message-reformatting" />
                                    <!--[if !mso]><!-->
                                    <link href="https://fonts.googleapis.com/css?family=Noto+Serif:400,400i,700,700i|Raleway:400,400i,700,700i" rel="stylesheet" />
                                    <!--<![endif]-->
                                    <title>Email Templateffffff</title>
                                    <!--[if gte mso 9]>
                                    <style type="text/css" media="all">
                                        sup { font-size: 100% !important; }
                                    </style>
                                    <![endif]-->
                                    
                                
                                    <style type="text/css" media="screen">
                                        /* Linked Styles */
                                        body { padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#333545; -webkit-text-size-adjust:none }
                                        a { color:#4e54cb; text-decoration:none }
                                        p { padding:0 !important; margin:0 !important } 
                                        /* return  <tr align={style.imageAlignment}>
                                          <td style={{margin:"0 auto",width:"100%",background:"red"}}  >
                                            <table>
                                              <tr>
                                                <td>
                                
                                                </td>
                                
                                              </tr>
                                            </table>
                                            </td></tr> */
                                        img { -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */ }
                                        .mcnPreviewText { display: none !important; }
                                        .text-footer a { color: #7e7e7e !important; }
                                        .text-footer2 a { color: #c3c3c3 !important; }
                                        
                                        /* Mobile styles */
                                        @media only screen and (max-device-width: 480px), only screen and (max-width: 480px) {
                                            .mobile-shell { width: 100% !important; min-width: 100% !important; }
                                            
                                            .m-center { text-align: center !important; }
                                            .m-left { margin-right: auto !important; }
                                            
                                            .center { margin: 0 auto !important; }
                                            
                                            .td { width: 100% !important; min-width: 100% !important; }
                                
                                            .m-br-15 { height: 15px !important; }
                                            .m-separator { border-bottom: 1px solid #000000; }
                                            .small-separator { border-top: 1px solid #333333 !important; padding-bottom: 20px !important; }
                                
                                            .m-td,
                                            .m-hide { display: none !important; width: 0 !important; height: 0 !important; font-size: 0 !important; line-height: 0 !important; min-height: 0 !important; }
                                
                                            .m-block { display: block !important; }
                                
                                            .fluid-img img { width: 100% !important; max-width: 100% !important; height: auto !important; }
                                            
                                            .content-middle { width: 140px !important; padding: 0px !important; }
                                
                                            .text-white { font-size: 12px !important; }
                                
                                            .h2-white { font-size: 46px !important; line-height: 50px !important; }
                                            .h3-white { font-size: 24px !important; line-height: 30px !important; }
                                
                                            .mpb15 { padding-bottom: 15px; }
                                            .content { padding: 20px 15px !important; }
                                
                                            .section-inner { padding: 0px !important; }
                                
                                            .content-2 { padding: 30px 15px 30px 15px !important; }
                                            .pt30 { padding-top: 20px !important; }
                                            .p30-15 { padding: 30px 15px !important; }
                                            .footer { padding: 30px 15px !important; }
                                            .main { padding: 0px !important; }
                                            .section { padding: 30px 15px 30px 15px !important; }
                                            .section2 { padding: 0px 15px 30px 15px !important; }
                                            .section4 { padding: 30px 15px !important; }
                                            .section-inner2 { padding: 30px 15px !important; }
                                
                                            .separator-outer { padding-bottom: 30px !important; }
                                            .section3 { padding: 30px 15px !important; }
                                            .mpb10 { padding-bottom: 10px !important; padding-top: 5px !important; }
                                            .preheader { padding-bottom: 20px !important; } 
                                
                                            .column,
                                            .column-dir,
                                            .column-top,
                                            .column-empty,
                                            .column-empty2,
                                            .column-bottom,
                                            .column-dir-top,
                                            .column-dir-bottom { float: left !important; width: 100% !important; display: block !important; }
                                            .column-empty { padding-bottom: 30px !important; }
                                            .column-empty2 { padding-bottom: 10px !important; }
                                            .content-spacing { width: 15px !important; }
                                        }
                                    </style>
                                </head>
                                <body class="body" style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#333545; -webkit-text-size-adjust:none;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#333545">
                                        <tr>
                                            <td align="center" valign="top">
                                                <!-- Main -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td align="center">
                                                            <table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                                                                <tr>
                                                                    <td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                                                                        <!-- Pre Header -->
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                            <tr>
                                                                                <td class="preheader" style="padding:30px 0px 20px 0px;">
                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                        <tr >
                                                                                            <th    class="column-top" width="240" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
                                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                    <tr >
                                                                                                        <td align="left">
                                                                                                            <table border="0" cellspacing="0" cellpadding="0" class="center" style="text-align:center;">
                                                                                                                <tr>
                                                                                                                    <td class="text-header" style="color:#85868d; font-family:'Raleway', Arial,sans-serif; font-size:13px; line-height:18px; text-align:left;"><multiline><a href="#" target="_blank" class="link2" style="color:#85868d; text-decoration:none;"><span class="link2" style="color:#85868d; text-decoration:none;">Enjoy free shipping and returns.</span></a></multiline></td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </th>
                                                                                            <th class="column-empty2" width="1" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;"></th>
                                                                                            <th class="column" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                    <tr >
                                                                                                        <td align="right">
                                                                                                            <table border="0" cellspacing="0" cellpadding="0" class="center" style="text-align:center;">
                                                                                                                <tr>
                                                                                                                    <td class="text-header" style="color:#85868d; font-family:'Raleway', Arial,sans-serif; font-size:13px; line-height:18px; text-align:left;"><multiline>
                                                                                                                        <webversion class="link2" style="color:#85868d; text-decoration:none;">View Online</webversion> | <forwardtoafriend class="link2" style="color:#85868d; text-decoration:none;">Forward</forwardtoafriend></multiline>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </th>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <!-- END Pre Header -->
                                
                                                                        <!-- Header -->
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                                            <tr>
                                                                                <td style="padding: 30px 0px 30px 30px;">
                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" dir="rtl" style="direction: rtl;">
                                                                                        <tr>
                                                                                            <th  class="column-dir" dir="ltr" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;">
                                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                    <tr>
                                                                                                        <td class="img-right" style="font-size:0pt; line-height:0pt; text-align:right;"><img src="images/free.jpg" width="118" height="38" editable="true" border="0" alt="" /></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </th>
                                                                                            <th class="column-empty" width="1" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;"></th>
                                                                                            <th class="column-dir" dir="ltr" width="200" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;">
                                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                    <tr>
                                                                                                        <td class="img m-center mpb10" style="font-size:0pt; line-height:0pt; text-align:left;"><img src="images/logo.png" width="197" height="14" editable="true" border="0" alt="" /></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </th>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <!-- END Header -->
                                
                                                                        <repeater>
                                                                            <!-- Intro -->
                                                                            <!-- <layout label='Intro'> -->
                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4e54cb">
                                                                                    <tr>
                                                                                        <td class="column" width="325" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                                                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                <tr>
                                                                                                    <td class="fluid-img" style="font-size:0pt; line-height:0pt; text-align:left;"><img src="images/t3_image1.jpg" width="325" height="400" editable="true" border="0" alt="" /></td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <th class="column" width="325" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                                                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                <tr>
                                                                                                    <td class="content" style="padding:30px 50px;">
                                                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                            <tr>
                                                                                                                <td class="text-white left pb15" style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px; line-height:20px; text-transform:uppercase; text-align:left; padding-bottom:15px;"><multiline>new colors</multiline></td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <td class="h2-white left pb20" style="color:#ffffff; font-family:Arial, sans-serif; font-size:52px; line-height:58px; text-transform:uppercase; font-weight:bold; text-align:left; padding-bottom:20px;"><multiline>new <br />season</multiline></td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <td class="text4 left pb20" style="color:#d2d4ff; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:24px; text-align:left; padding-bottom:20px;"><multiline>We are committed to your satisfaction with every order.</multiline></td>
                                                                                                            </tr>
                                                                                                            <!-- Button -->
                                                                                                            <tr>
                                                                                                                <td align="left">
                                                                                                                    <table width="140" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tr>
                                                                                                                            <td class="text-button white-button" style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:#ffffff; color:#f54084; font-weight:bold;"><multiline><a href="#" target="_blank" class="link" style="color:#4e54cb; text-decoration:none;"><span class="link" style="color:#4e54cb; text-decoration:none;">shop now</span></a></multiline></td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            <!-- END Button -->
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </table>
                                                                            <!-- </layout> -->
                                                                            <!-- END Intro -->
                                
                                                                            <!-- Three Products -->
                                                                            <layout label='Three Products'>
                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                                                    <tr>
                                                                                        <td class="p30-15" style="padding: 60px 30px;">
                                                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                <tr>
                                                                                                    <td class="section-title" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:14px; line-height:20px; text-align:center; padding-bottom:40px; text-transform:uppercase;"><multiline>p o p u l a r &nbsp; P R O D U C T S</multiline></td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>
                                                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                            <tr>
                                                                                                                <th class="column-top" width="190" bgcolor="#ffffff" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
                                                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tr>
                                                                                                                            <td class="img-center pb20" style="font-size:0pt; line-height:0pt; text-align:center; padding-bottom:20px;"><img src="images/t4_image4.jpg" width="190" height="240" editable="true" border="0" alt="" /></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="text-title2 pb15 m-center" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:20px; line-height:24px; text-align:left; padding-bottom:15px;"><multiline>Straw Boater Hat</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="text2 pb20 m-center" style="color:#585858; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:20px; text-align:left; padding-bottom:20px;"><multiline>Straw Boater Hat features in our Accessories collection</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="price pb20 m-center" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:20px;"><multiline>Price: &nbsp; <span class="old-price" style="text-decoration:line-through; color:#585858;">$50.00</span> &nbsp; <strong class="new-price" style="text-decoration:line-through; color:#4e54cb;">$20.00</strong></multiline></td>
                                                                                                                        </tr>
                                                                                                                        <!-- Button -->
                                                                                                                        <tr>
                                                                                                                            <td align="left">
                                                                                                                                <table class="center" width="140" border="0" cellspacing="0" cellpadding="0" style="text-align:center;">
                                                                                                                                    <tr>
                                                                                                                                        <td class="text-button purple-button" style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:transparent; border:1px solid #000000; color:#000000;"><multiline><a href="#" target="_blank" class="link-black" style="color:#000001; text-decoration:none;"><span class="link-black" style="color:#000001; text-decoration:none;">view more</span></a></multiline></td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <!-- END Button -->
                                                                                                                    </table>
                                                                                                                </th>
                                                                                                                <th class="column-empty" width="10" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;"></th>
                                                                                                                <th class="column-top" width="190" bgcolor="#ffffff" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
                                                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tr>
                                                                                                                            <td class="img-center pb20" style="font-size:0pt; line-height:0pt; text-align:center; padding-bottom:20px;"><img src="images/t4_image5.jpg" width="190" height="240" editable="true" border="0" alt="" /></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="text-title2 pb15 m-center" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:20px; line-height:24px; text-align:left; padding-bottom:15px;"><multiline>Yellow Dress</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="text2 pb20 m-center" style="color:#585858; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:20px; text-align:left; padding-bottom:20px;"><multiline>Yellow Dress Cover Up features in our Winter collection</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="price pb20 m-center" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:20px;"><multiline>Price: &nbsp; <span class="old-price" style="text-decoration:line-through; color:#585858;">$150</span> &nbsp; <strong class="new-price" style="text-decoration:line-through; color:#4e54cb;">$100.00</strong></multiline></td>
                                                                                                                        </tr>
                                                                                                                        <!-- Button -->
                                                                                                                        <tr>
                                                                                                                            <td align="left">
                                                                                                                                <table class="center" width="140" border="0" cellspacing="0" cellpadding="0" style="text-align:center;">
                                                                                                                                    <tr>
                                                                                                                                        <td class="text-button purple-button" style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:transparent; border:1px solid #000000; color:#000000;"><multiline><a href="#" target="_blank" class="link-black" style="color:#000001; text-decoration:none;"><span class="link-black" style="color:#000001; text-decoration:none;">view more</span></a></multiline></td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <!-- END Button -->
                                                                                                                    </table>
                                                                                                                </th>
                                                                                                                <th class="column-empty" width="10" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;"></th>
                                                                                                                <th class="column-top" width="190" bgcolor="#ffffff" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
                                                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tr>
                                                                                                                            <td class="img-center pb20 m-center" style="font-size:0pt; line-height:0pt; text-align:center; padding-bottom:20px;"><img src="images/t4_image6.jpg" width="190" height="240" editable="true" border="0" alt="" /></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="text-title2 pb15 m-center" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:20px; line-height:24px; text-align:left; padding-bottom:15px;"><multiline>Denim Top</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="text2 pb20 m-center" style="color:#585858; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:20px; text-align:left; padding-bottom:20px;"><multiline>Denim Summer Top 2018 Euro Style Long Shirt</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="price pb20 m-center" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:20px;"><multiline>Price: &nbsp; <span class="old-price" style="text-decoration:line-through; color:#585858;">$80.00</span> &nbsp; <strong class="new-price" style="text-decoration:line-through; color:#4e54cb;">$50.00</strong></multiline></td>
                                                                                                                        </tr>
                                                                                                                        <!-- Button -->
                                                                                                                        <tr>
                                                                                                                            <td align="left">
                                                                                                                                <table width="140" border="0" cellspacing="0" cellpadding="0" class="center" style="text-align:center;"> 
                                                                                                                                    <tr>
                                                                                                                                        <td class="text-button purple-button" style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:transparent; border:1px solid #000000; color:#000000;"><multiline><a href="#" target="_blank" class="link-black" style="color:#000001; text-decoration:none;"><span class="link-black" style="color:#000001; text-decoration:none;">view more</span></a></multiline></td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <!-- END Button -->
                                                                                                                    </table>
                                                                                                                </th>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </layout>
                                                                            <!-- END Three Products -->
                                
                                                                            <!-- Coupon -->
                                                                            <layout label='Coupon'>
                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f54084" dir="rtl" style="direction: rtl;">
                                                                                    <tr>
                                                                                        <th class="column-dir" dir="ltr"  width="220" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;">
                                                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                <tr>
                                                                                                    <td class="fluid-img" style="font-size:0pt; line-height:0pt; text-align:left;"><img src="images/t4_image7.jpg" width="220" height="295" editable="true" border="0" alt="" /></td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th class="column-dir" dir="ltr"  style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;">
                                                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                <tr>
                                                                                                    <td class="p30-15" style="padding: 30px;">
                                                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                            <tr>
                                                                                                                <td class="content-inner" style="padding:30px; border:1px dashed #ffffff;">
                                                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tr>
                                                                                                                            <td class="text-white3 pb10" style="color:#ffffff; font-family:Arial, sans-serif; font-size:18px; line-height:24px; text-align:center; text-transform:uppercase; padding-bottom:10px;"><multiline>buy 2 items</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="h4 white center pb10" style="font-family:'Noto Serif', Georgia, serif; font-size:34px; line-height:40px; color:#ffffff; text-align:center; padding-bottom:10px;"><multiline>GET 1 FOR FREE</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td class="h5 white center pb15" style="font-family:Arial,sans-serif; font-size:14px; line-height:24px; text-transform:uppercase; color:#ffffff; text-align:center; padding-bottom:15px;"><multiline>USE CODE: 12458</multiline></td>
                                                                                                                        </tr>
                                                                                                                        <!-- Button -->
                                                                                                                        <tr>
                                                                                                                            <td align="center">
                                                                                                                                <table width="140" border="0" cellspacing="0" cellpadding="0">
                                                                                                                                    <tr>
                                                                                                                                        <td class="text-button white-button" style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:#ffffff; color:#f54084; font-weight:bold;"><multiline><a href="#" target="_blank" class="link-pink" style="color:#f54084; text-decoration:none;"><strong class="link-pink" style="color:#f54084; text-decoration:none;">shop now</strong></a></multiline></td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <!-- END Button -->
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </table>
                                                                            </layout>
                                                                            <!-- END Coupon -->
                                
                                                                            <!-- Two Columns -->
                                                                            <layout label='Two Columns'>
                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                                                    <tr>
                                                                                        <td class="p30-15" style="padding: 50px 30px;">
                                                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                <tr>
                                                                                                    <td class="section-title" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:14px; line-height:20px; text-align:center; padding-bottom:40px; text-transform:uppercase;"><multiline>T R E N D I N G  P R O D U C T S</multiline></td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td class="section-inner">
                                                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                            <tr>
                                                                                                                <th class="column-top" width="280" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
                                                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tr>
                                                                                                                            <td class="fluid-img pb20" style="font-size:0pt; line-height:0pt; text-align:left; padding-bottom:20px;"><img src="images/t2_image2.jpg" width="280" height="410" editable="true" border="0" alt="" /></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td>
                                                                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                                    <tr>
                                                                                                                                        <td class="text-title pb10" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:22px; line-height:32px; text-align:left; padding-bottom:10px;"><multiline>Athena Coat</multiline></td>
                                                                                                                                    </tr>
                                                                                                                                    <tr>
                                                                                                                                        <td class="text2 pb15" style="color:#585858; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:20px; text-align:left; padding-bottom:15px;"><multiline>Beige solid longline overcoat, has a spread collar, 2 pockets, zip closure, long sleeves, straight hem.</multiline></td>
                                                                                                                                    </tr>
                                                                                                                                    <tr>
                                                                                                                                        <td class="price pb25" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:25px;"><multiline>Price: <span class="old-price" style="text-decoration:line-through; color:#585858;">$250.00</span> <span class="purple" style="color:#4e54cb;">$199.00</span></multiline></td>
                                                                                                                                    </tr>
                                                                                                                                    <!-- Button -->
                                                                                                                                    <tr>
                                                                                                                                        <td align="left">
                                                                                                                                            <table width="140" border="0" cellspacing="0" cellpadding="0">
                                                                                                                                                <tr>
                                                                                                                                                    <td class="text-button black-button" style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:transparent !important; border:1px solid #000000; color:#000000;"><multiline><a href="#" target="_blank" class="link-black" style="color:#000001; text-decoration:none;"><span class="link-black" style="color:#000001; text-decoration:none;">buy now</span></a></multiline></td>
                                                                                                                                                </tr>
                                                                                                                                            </table>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                    <!-- END Button -->
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </th>
                                                                                                                <th class="column-empty" width="30" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;"></th>
                                                                                                                <th class="column-top" width="280" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
                                                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tr>
                                                                                                                            <td class="fluid-img pb20" style="font-size:0pt; line-height:0pt; text-align:left; padding-bottom:20px;"><img src="images/t2_image3.jpg" width="280" height="410" editable="true" border="0" alt="" /></td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td>
                                                                                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                                                    <tr>
                                                                                                                                        <td class="text-title pb10" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:22px; line-height:32px; text-align:left; padding-bottom:10px;"><multiline>White Outerwear</multiline></td>
                                                                                                                                    </tr>
                                                                                                                                    <tr>
                                                                                                                                        <td class="text2 pb15" style="color:#585858; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:20px; text-align:left; padding-bottom:15px;"><multiline>Complete any outfit with the White Out Distressed Denim Jacket. Featuring an oversized fit.</multiline></td>
                                                                                                                                    </tr>
                                                                                                                                    <tr>
                                                                                                                                        <td class="price pb25" style="color:#000000; font-family:'Noto Serif', Georgia, serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:25px;"><multiline>Price: <span class="old-price" style="text-decoration:line-through; color:#585858;">$280.00</span> <span class="purple" style="color:#4e54cb;">$199.00</span></multiline></td>
                                                                                                                                    </tr>
                                                                                                                                    <!-- Button -->
                                                                                                                                    <tr>
                                                                                                                                        <td align="left">
                                                                                                                                            <table width="140" border="0" cellspacing="0" cellpadding="0">
                                                                                                                                                <tr>
                                                                                                                                                    <td class="text-button black-button" style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:transparent !important; border:1px solid #000000; color:#000000;"><multiline><a href="#" target="_blank" class="link-black" style="color:#000001; text-decoration:none;"><span class="link-black" style="color:#000001; text-decoration:none;">buy now</span></a></multiline></td>
                                                                                                                                                </tr>
                                                                                                                                            </table>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                    <!-- END Button -->
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </th>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </layout>
                                                                            <!-- END Two Columns -->
                                                                        </repeater>
                                 
                                                                        <!-- Footer -->
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4e54cb">
                                                                            <tr>
                                                                                <td class="footer" style="padding:60px 30px;">
                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                        <tr>
                                                                                            <td class="social-title pb30" style="color:#ffffff; font-family:'Raleway', Arial, sans-serif; font-size:14px; line-height:22px; text-align:center; text-transform:uppercase; padding-bottom:30px;"><multiline>f o l l o w &nbsp; u s</multiline></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="pb30" align="center" style="padding-bottom:30px;">
                                                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                                                    <tr>
                                                                                                        <td class="img" width="50" style="font-size:0pt; line-height:0pt; text-align:left;"><a href="#" target="_blank"><img src="images/t_white_ico_facebook.png" width="40" height="40" editable="true" border="0" alt="" /></a></td>
                                                                                                        <td class="img" width="50" style="font-size:0pt; line-height:0pt; text-align:left;"><a href="#" target="_blank"><img src="images/t_white_ico_twitter.png" width="40" height="40" editable="true" border="0" alt="" /></a></td>
                                                                                                        <td class="img" width="50" style="font-size:0pt; line-height:0pt; text-align:left;"><a href="#" target="_blank"><img src="images/t_white_ico_gplus.png" width="40" height="40" editable="true" border="0" alt="" /></a></td>
                                                                                                        <td class="img" width="50" style="font-size:0pt; line-height:0pt; text-align:left;"><a href="#" target="_blank"><img src="images/t_white_ico_youtube.png" width="40" height="40" editable="true" border="0" alt="" /></a></td>
                                                                                                        <td class="img" width="50" style="font-size:0pt; line-height:0pt; text-align:left;"><a href="#" target="_blank"><img src="images/t_white_ico_pinterest.png" width="40" height="40" editable="true" border="0" alt="" /></a></td>
                                                                                                        <td class="img" width="40" style="font-size:0pt; line-height:0pt; text-align:left;"><a href="#" target="_blank"><img src="images/t_white_ico_linkedin.png" width="40" height="40" editable="true" border="0" alt="" /></a></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="separator" style="border-bottom:1px solid #5e63d3;"></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="text-footer pt30" style="color:#a9ace3; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:20px; text-align:center; padding-top:30px;"><multiline>Copyright &copy; 0123 Shopilicious <br />728 Dooley Branch, Beckershire, LA 63598-2909</multiline></td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <!-- END Footer -->
                                                                        
                                                                        <!-- Footer Bar -->
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                            <tr>
                                                                                <td class="footer-bar" style="padding:35px 15px;">
                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                        <tr>
                                                                                            <td class="text-footer2" style="color:#85868d; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:20px; text-align:center;">
                                                                                                <multiline>You are receiving this email because you have subscribed to receive updates from us. <br />Should you wish to cancel your subscription, please</multiline>
                                                                                                <unsubscribe class="link-footer-u" style="color:#c3c3c3; text-decoration:underline;">click here to unsubscribe</unsubscribe>.
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <!-- END Footer Bar -->
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!-- END Main -->
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                                </html>
                                `
                            }, sendNext);
                           
                        // sender({
                        //     to: list[sent] || "dangabarin2005@gmail.com",
                        //     subject: 'Test message #' + sent,
                        //     text: 'hello world!'
                        // }, sendNext);
                    };
          
                    sendNext();
          
                });
            });
          });
    })
}
  

module.exports= {rabbitProvider}