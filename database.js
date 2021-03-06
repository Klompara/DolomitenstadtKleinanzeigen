const redisLibrary = require('redis');
let users;
let offers;
let client;

async function initDatabase() {
    let startTimeStamp = new Date();
    client = redisLibrary.createClient({
        socket: {
            url: process.env.REDIS_CON
        }
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    let usersStr = await client.get('users');
    let offersStr = await client.get('offers');
    users = JSON.parse(usersStr);
    offers = JSON.parse(offersStr);
    for (let i = 0; i < offers.length; i++) {
        offers[i].scrapeDate = new Date(offers[i].scrapeDate); // Dates are not parsed
    }
    console.log(`Loaded Redis data: [users:${users.length}] [offers:${offers.length}] duration: ${(new Date() - startTimeStamp) / 1000} seconds`);
}

async function saveToRedis() {
    let startTimeStamp = new Date();
    await client.set('users', JSON.stringify(users));
    await client.set('offers', JSON.stringify(offers));
    console.log(`Saved to Redis, duration: ${(new Date() - startTimeStamp) / 1000} seconds`);
}

// return status message which is send to user
function toggleInterest(userId, interest) {
    let user = users.find(user => user.userId == userId);
    if (user == undefined) {
        return messageUnsubscribeAlready;
    }

    if (user.interests.includes(interest)) {
        user.interests.splice(user.interests.indexOf(interest), 1);
        console.log(`Removed interest ${interest} from user ${user.username}`);
        return interestUnsubscribed.replace('<%interest%>', interest);
    } else {
        user.interests.push(interest);
        console.log(`Added interest ${interest} to user ${user.username}`);
        return interestSubscribed.replace('<%interest%>', interest);;
    }
}

// Return true if successfull, false if already subscribed
function subscribeUser(userId, name, username, type) {
    if (users.find(user => user.userId == userId) != undefined) {
        console.log(`User ${username} is already subscribed!`);
        return false;
    }

    users.push({
        userId: userId,
        name: name,
        username: username,
        type: type,
        seenOffers: [],
        interests: []
    });
    console.log(`User ${username} successfully subscribed!`);
    return true;
}

function unsubscribeUser(userId) {
    let userIndex = users.indexOf(users.find(user => user.userId == userId));
    if (userIndex == -1) {
        console.log(`User ${userId} is not subscribed!`);
        return false;
    } else {
        let name = users[userIndex].username;
        users.splice(userIndex, 1);
        console.log(`User ${name} successfully unsubscribed!`);
    }

    return true;
}

function getUsersOffers() {
    let usersToSend = [];
    users.forEach(user => {
        offers.forEach(offer => {
            if (user.seenOffers.find(off => off.offerId == offer.offerId) == undefined // hasn't seen
                && user.interests.includes(offer.type)) { // and is interested
                let needleUser = usersToSend.find(userToSend => userToSend.user.userId == user.userId);
                if (needleUser == undefined) {
                    usersToSend.push({ user: user, offers: [offer] });
                } else {
                    needleUser.offers.push(offer);
                }
                user.seenOffers.push(offer);
            }
        });
    });

    return usersToSend;
}

function addAllInterests(user) {
    user.interests = [];
    for (let i = 0; i < commands.length; i++) {
        user.interests.push(commands[i].type);
    }
}

function removeAllInterests(user) {
    user.interests = [];
}

function addOfferIfNotExists(scraped) {
    let added = false;
    for (let i = 0; i < scraped.length; i++) {
        if (offers.find(curr => curr.offerId == scraped[i].offerId) == undefined) {
            offers.push(scraped[i]);
            added = true;
        }
    }
    return added;
}

function clearOldOffers() {
    let countBefore = offers.length;
    offers = offers.filter(offer => new Date() - offer.scrapeDate < 1000 * 60 * 60 * 24 * maxOffersAgeDays) // remove offers older than 31 days
    console.log(`Removed ${countBefore - offers.length} outdated offers`);
}

function getUser(userId) {
    return users.find(user => user.userId == userId);
}

function getOffers() {
    return offers;
}

function getUsers() {
    return users;
}

module.exports.subscribeUser = subscribeUser;
module.exports.unsubscribeUser = unsubscribeUser;
module.exports.getUsersOffers = getUsersOffers;
module.exports.addOfferIfNotExists = addOfferIfNotExists;
module.exports.toggleInterest = toggleInterest;
module.exports.clearOldOffers = clearOldOffers;
module.exports.getUser = getUser;
module.exports.getOffers = getOffers;
module.exports.getUsers = getUsers;
module.exports.addAllInterests = addAllInterests;
module.exports.removeAllInterests = removeAllInterests;
module.exports.initDatabase = initDatabase;
module.exports.saveToRedis = saveToRedis;