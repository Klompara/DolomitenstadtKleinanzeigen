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
        `*${offer.title}*
${offer.description}

_${offer.phone || ''}_
Benutzer: _${offer.originalPoster}_
${offer.createDate}
`;
    return msg;
}

async function sendMessageWithImage(userId, msg, imgUrl) {
    let payload = {
        chat_id: userId,
        caption: msg,
        photo: imgUrl,
        parse_mode: 'markdown'
    }

    return sendMsg('sendPhoto', payload);
}

async function sendMessage(userId, msg) {
    let payload = {
        chat_id: userId,
        text: msg,
        parse_mode: 'markdown'
    }

    return sendMsg('sendMessage', payload);
}

async function sendMsg(method, payload) {
    return new Promise((resolve, rejects) => {
        let userId = payload.chat_id;

        let queryString = Object.keys(payload).map(key => key + '=' + payload[key]).join('&');
        queryString = encodeURI(queryString);
        let options = {
            hostname: `api.telegram.org`,
            port: 443,
            path: `/bot${process.env.BOT_KEY}/${method}?${queryString}`,
            method: 'GET'
        };

        let request = https.request(options, (res) => {
            resolve();
        });

        request.on('error', (e) => {
            console.log(`Error when sending message to user ${userId}: ${e}`);
            rejects(e);
        });
        request.end();
    });
}

module.exports.sendMessage = sendMessage;
module.exports.sendMessageWithImage = sendMessageWithImage;
module.exports.sendOffer = sendOffer;