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
            console.log(`Sending offer ${offer.offerId} to user ${useroffer.user.username}`);
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
        sendAdminInfo(userObj.id);
    }
}

function sendAdminInfo(id) {
    if (id == process.env.ADMIN_ID) { // admin information
        database.getUsers().forEach(user => {
            let interests = user.interests.length > 0 ? user.interests.reduce((acc, curr) => acc + ', ' + curr) : '';
            let msg = 'userid: ' + user.userId + '\nname: ' + user.name + '\nusername: ' + user.username + '\ntype: ' + user.type + '\ninterests:\n\t' + interests
            telegram.sendMessage(id, msg);
        });
    }
}

async function sendHelp(message) {
    await telegram.sendMessage(message.chat.id, msgHelp);
}

async function addAllInterests(message) {
    let user = database.getUser(message.chat.id);
    if (user == undefined) {
        await telegram.sendMessage(message.chat.id, messageUnsubscribeAlready);
    } else {
        await telegram.sendMessage(message.chat.id, allSubscribed);
        database.addAllInterests(user);
        await checkSendOffer();
    }
}

async function removeAllinterests(message) {
    let user = database.getUser(message.chat.id);
    if (user == undefined) {
        await telegram.sendMessage(message.chat.id, messageUnsubscribeAlready);
    } else {
        await telegram.sendMessage(message.chat.id, allUnsubscribed);
        database.removeAllInterests(user);
        await checkSendOffer();
    }
}

module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;
module.exports.toggleInterest = toggleInterest;
module.exports.sendInfo = sendInfo;
module.exports.sendHelp = sendHelp;
module.exports.removeAllinterests = removeAllinterests;
module.exports.addAllInterests = addAllInterests;
module.exports.checkSendOffer = checkSendOffer;