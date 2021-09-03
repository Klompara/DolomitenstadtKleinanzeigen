const database = require('./database');
const telegram = require('./telegramInterface');

async function subscribe(message) {
    let userObj = message.chat;
    let success = database.subscribeUser(userObj.id, userObj.first_name, userObj.username, userObj.type);
    await telegram.sendMessage(userObj.id, success ? global.messageSubscribeSuccess : global.messageSubscribeAlready);
    await checkSendImmobilien();
}

async function unsubscribe(message) {
    let userObj = message.chat;
    let success = database.unsubscribeUser(userObj.id);
    await telegram.sendMessage(userObj.id, success ? global.messageUnsubscribeSuccess : messageUnsubscribeAlready);
}

async function checkSendImmobilien() {
    let toSendOffers = database.getUsersOffers();
    for (let i = 0; i < toSendOffers.length; i++) {
        let useroffer = toSendOffers[i];
        for (let j = 0; j < useroffer.immobilien.length; j++) {
            let immobilie = useroffer.immobilien[j];
            await telegram.sendMessage(useroffer.user.userId, immobilie.text);
        }
    }
}

module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;