const database = require('./database');
const telegram = require('./telegramInterface');

async function subscribe(message) {
    let userObj = message.chat;

    let success = database.subscribeUser(userObj.id, userObj.first_name, userObj.username, userObj.type);
    console.log(success);
    if (success) {
        await telegram.sendMessage(userObj.id, 'Glückwunsch, du hast dich Erfolgreich angemeldet! Schreibe /unsubscribe um dich wieder abzumelden.');
    } else {
        await telegram.sendMessage(userObj.id, 'Du bist bereits Angemeldet! Schreibe /unsubscribe um dich wieder abzumelden.');
    }

    await checkSendImmobilien();
}

async function unsubscribe(message) {
    let userObj = message.chat;

    let success = database.unsubscribeUser(userObj.id);
    console.log(success);
    if (success) {
        await telegram.sendMessage(userObj.id, 'Glückwunsch, du hast dich Erfolgreich abgemeldet! Schreibe /subscribe um dich wieder anzumelden.');
    } else {
        await telegram.sendMessage(userObj.id, 'Du bist noch nicht angemeldet! Schreibe /subscribe um dich anzumelden.');
    }
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