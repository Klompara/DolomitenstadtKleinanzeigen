const https = require('https');



async function sendOffer(userId, offer) {
    let msg = buildMessage(offer);
    if (offer.imageUrl != undefined) {
        return sendMessageWithImage(userId, msg, offer.imageUrl);
    } else {
        return sendMessage(userId, msg);
    }
}

function buildMessage(offer) {
    let msg =
        `${offer.title}
${offer.description}

${offer.phone || ''}
Benutzer: ${offer.originalPoster}
${offer.createDate}
`;
    return msg;
}

async function sendMessageWithImage(userId, msg, imgUrl) {
    let payload = {
        chat_id: userId,
        caption: msg,
        photo: imgUrl,
        parse_mode: 'Markdown'
    }

    return sendMsg('sendPhoto', payload);
}

async function sendMessage(userId, msg) {
    let payload = {
        chat_id: userId,
        text: msg,
        parse_mode: 'Markdown'
    }

    return sendMsg('sendMessage', payload);
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

        let request = https.request(options, (res) => {
            resolve();
        });

        request.on('error', (e) => {
            console.log(`Error when sending message to user ${userId}: ${e}`);
            rejects(e);
        });
        request.write(payload);
        request.end();
    });
}

module.exports.sendMessage = sendMessage;
module.exports.sendMessageWithImage = sendMessageWithImage;
module.exports.sendOffer = sendOffer;