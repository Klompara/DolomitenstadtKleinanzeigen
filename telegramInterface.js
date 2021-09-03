const https = require('https');

async function sendMessage(userId, msg) {
    return new Promise((resolve, rejects) => {
        msg = encodeURI(msg);

        let options = {
            hostname: `api.telegram.org`,
            port: 443,
            path: `/bot${process.env.BOT_KEY}/sendMessage?chat_id=${userId}&text=${msg}`,
            method: 'GET'
        };

        let request = https.request(options, (res) => { resolve(); });

        request.on('error', (e) => {
            console.log(`Error when sending message to user ${userId}: ${e}`);
            rejects(e);
        });

        request.end();
    });
}

module.exports.sendMessage = sendMessage;