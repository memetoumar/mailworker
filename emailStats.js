const express = require('express');
const bodyParser = require('body-parser');
const userAgentParser = require('user-agent-parser');

const app = express();
app.use(bodyParser.json());

const port = 3000;

// In-memory storage for simplicity; use a database in production
const emailStats = {};

app.get('/track/open', (req, res) => {
    const { guid } = req.query;
    const userAgent = req.headers['user-agent'];
    const deviceInfo = userAgentParser(userAgent);

    if (guid) {
        if (!emailStats[guid]) {
            emailStats[guid] = { opens: 0, clicks: 0, devices: {}, emailClients: {}, readDurations: [] };
        }
        emailStats[guid].opens += 1;

        // Track device type and email client
        const deviceType = deviceInfo.device.type || 'unknown';
        const emailClient = deviceInfo.browser.name || 'unknown';
        
        emailStats[guid].devices[deviceType] = (emailStats[guid].devices[deviceType] || 0) + 1;
        emailStats[guid].emailClients[emailClient] = (emailStats[guid].emailClients[emailClient] || 0) + 1;
    }

    // Respond with a 1x1 transparent pixel
    const img = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/pmFEkYAAAAASUVORK5CYII=',
        'base64'
    );
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img);
});
app.get('/track/click', (req, res) => { 
    const { guid, url } = req.query; 
    if (guid && url) {
         if (!emailStats[guid]) {
             emailStats[guid] = { opens: 0, clicks: 0, devices: {}, emailClients: {}, readDurations: [] };
             } 
             emailStats[guid].clicks += 1; 
             // Record the click event with timestamp
              emailStats[guid].readDurations.push({ type: 'click', timestamp: new Date() }); 
              // Redirect to the actual URL
               res.redirect(url); } else { res.status(400).send('Missing guid or url parameter'); } });

app.get('/stats/:guid', (req, res) => {
     const { guid } = req.params;
      if (emailStats[guid]) { 
        res.json(emailStats[guid]);
     } 
     else
      { 
        res.status(404).send('No stats found for this guid');
     }
     }); 
     
