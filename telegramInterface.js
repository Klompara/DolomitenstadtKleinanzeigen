const https = require('https');

async function sendMessage(userId, msg) {
    let payload = {
        chat_id: userId,
        text: msg
    }

    return sendMsg('sendMessage', payload);
}

async function sendMessageWithImage(userId, msg, imgUrl) {
    let payload = {
        chat_id: userId,
        caption: msg,
        photo: imgUrl
    }

    return sendMsg('sendPhoto', payload);
}

async function sendMsg(method, payload) {
    return new Promise((resolve, rejects) => {
        let userId = payload.chat_id;
        payload = JSON.stringify(payload);

        let options = {
            hostname: `api.telegram.org`,
            port: 443,
            path: `/bot${process.env.BOT_KEY}/${method}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        let request = https.request(options, (res) => { resolve(); });

        request.on('error', (e) => {
            console.log(`Error when sending message to user ${userId}: ${e}`);
            rejects(e);
        });
        console.log(payload);
        request.write(payload);
        request.end();
    });
}

module.exports.sendMessage = sendMessage;
module.exports.sendMessageWithImage = sendMessageWithImage;