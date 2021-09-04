const database = require('./database');
const telegram = require('./telegramInterface');

async function subscribe(message) {
    let userObj = message.chat;
    let success = database.subscribeUser(userObj.id, userObj.first_name, userObj.username, userObj.type);
    await telegram.sendMessage(userObj.id, success ? global.messageSubscribeSuccess : global.messageSubscribeAlready);
    await checkSendOffer();
}

async function unsubscribe(message) {
    let userObj = message.chat;
    let success = database.unsubscribeUser(userObj.id);
    await telegram.sendMessage(userObj.id, success ? global.messageUnsubscribeSuccess : messageUnsubscribeAlready);
    await checkSendOffer();
}

async function toggleInterest(message) {
    let userObj = message.chat;
    let interest = commands.find(command => command.command == message.text).type;
    let responseMessage = database.toggleInterest(userObj.id, interest);
    await telegram.sendMessage(userObj.id, responseMessage);
    await checkSendOffer();
}

async function checkSendOffer() {
    let toSendOffers = database.getUsersOffers();
    for (let i = 0; i < toSendOffers.length; i++) {
        let useroffer = toSendOffers[i];
        for (let j = 0; j < useroffer.offers.length; j++) {
            let offer = useroffer.offers[j];
            await telegram.sendOffer(useroffer.user.userId, offer);
        }
    }
}

module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;
module.exports.toggleInterest = toggleInterest;