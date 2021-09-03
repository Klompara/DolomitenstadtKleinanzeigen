const express = require('express');
const app = express();
const port = process.env.PORT || 6969;
const bodyParser = require('body-parser');
const handler = require('./commandHandler');
const scraper = require('./immobilienScraper');
require('./globals');
if (app.get('env') == 'development') { require('dotenv').config(); } // load environmental variables, local testing

app.use(bodyParser.json());

app.post('/', async (req, res) => {
    let message = req.body.message;
    if (message.text == '/subscribe') {
        handler.subscribe(message);
    } else if (message.text == '/unsubscribe') {
        handler.unsubscribe(message);
    }

    res.send(req.body);
});

app.listen(port, () => {
    console.log(`Dolomitenstadt Immobilien-Kleinanzeigen service listening at http://localhost:${port}`);
    setInterval(() => {
        scraper.getAllCurrentImmobilien();
    }, 10 * 60 * 60);
})