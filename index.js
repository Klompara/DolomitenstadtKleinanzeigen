const express = require('express');
const app = express();
const port = process.env.PORT || 6969;
const bodyParser = require('body-parser');
const handler = require('./commandHandler');
const scraper = require('./offerScraper');
const database = require('./database');
require('./globals');
if (app.get('env') == 'development') { require('dotenv').config(); } // load environmental variables, local testing

app.use(bodyParser.json());

app.post('/' + process.env.BOT_KEY, async (req, res) => {
    if (req.body == undefined || req.body.message == undefined) {
        res.send(req.body);
        return;
    }

    let message = req.body.message;
    if (message.text == '/start') {
        await handler.subscribe(message);
    } else if (message.text == '/stop') {
        await handler.unsubscribe(message);
    } else if (commands.find(command => command.command == message.text) != undefined) {
        await handler.toggleInterest(message);
    } else if (message.text == '/info') {
        await handler.sendInfo(message);
    } else if (message.text == '/help') {
        await handler.sendHelp(message);
    } else if (message.text == '/alle') {
        await handler.addAllInterests(message);
    } else if (message.text == '/keine') {
        await handler.removeAllinterests(message);
    }

    await database.saveToRedis();

    res.send(req.body);
});

app.listen(port, async () => {
    console.log(`Dolomitenstadt Kleinanzeigen service listening at http://localhost:${port}`);
    await database.initDatabase();
    async function scheduler() {
        await scraper.scrape();
        database.clearOldOffers();
        handler.checkSendOffer();
        await database.saveToRedis();
    }
    scheduler();
    setInterval(scheduler, 1000 * 60 * refreshTimeMinutes);
})