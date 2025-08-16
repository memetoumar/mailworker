const axios = require('axios');
const cheerio = require('cheerio');
// const emailRegex = require('email-regex');

const visitedUrls = new Set(); // To avoid visiting the same URL multiple times
const emails = new Set(); // To store unique emails
// const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{3,}/g;
const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}/g;
// const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         return emailRegex.test(email);
async function scrapePage(url) {
    if (visitedUrls.has(url)) return; // Avoid re-visiting URLs

    visitedUrls.add(url); 

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract emails from the current page
        const pageEmails = data.match(emailPattern);
        // console.log(data)
        console.log(pageEmails)
        if (pageEmails) {
            pageEmails.forEach(email => emails.add(email));
        }

        // Find and follow links to other pages on the same domain
        $('a[href]').each((i, link) => {
            const href = $(link).attr('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                const fullUrl = new URL(href, url).href;
                scrapePage(fullUrl);
            } else if (href && href.includes(url)) {
                scrapePage(href);
            }
        });
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
    }
}

(async () => {
    const startUrl = 'https://www.wedgewoodweddings.com'; // Replace with your target URL
    await scrapePage(startUrl);

    console.log('Emails found:');
    emails.forEach(email => console.log(email));
})();

 