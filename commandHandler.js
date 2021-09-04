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

async function sendInfo(message) {
    let userObj = message.chat;
    let user = database.getUser(userObj.id);
    if (user == undefined) {
        await telegram.sendMessage(userObj.id, messageUnsubscribeAlready);
    } else {
        let offers = database.getOffers();
        let interests = user.interests.length > 0 ? user.interests.reduce((acc, curr) => acc + ', ' + curr) : '';
        let msg = infotext.replace('<%interests%>', interests).replace('<%offerCount%>', offers.length);
        await telegram.sendMessage(userObj.id, msg);
        if (userObj.id == process.env.ADMIN_ID) { // admin information
            database.getUsers().forEach(user => {
                interests = user.interests.length > 0 ? user.interests.reduce((acc, curr) => acc + ', ' + curr) : '';
                telegram.sendMessage(userObj.id, user.username + ', ' + user.name + ', ' + user.type + ', ' + user.userId + ', (' + interests + ')');
            });
        }
    }
}

module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;
module.exports.toggleInterest = toggleInterest;
module.exports.sendInfo = sendInfo;