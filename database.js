let users = [];
let immobilien = [];

// testing
immobilien.push({ immobilieId: 123, text: 'test1' });
immobilien.push({ immobilieId: 124, text: 'test2' });
immobilien.push({ immobilieId: 125, text: 'test3' });

// Return true if successfull, false if already subscribed
function subscribeUser(userId, name, username, type) {
    if (users.find(user => user.userId == userId) != undefined) {
        console.log(`User ${username} is already subscribed!`);
        return false;
    }

    users.push({ userId: userId, name: name, username: username, type: type, seenOffers: [] });
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
        immobilien.forEach(immobilie => {
            if (user.seenOffers.find(imm => imm.immobilieId == immobilie.immobilieId) == undefined) {
                let needleUser = usersToSend.find(userToSend => userToSend.user.userId == user.userId);
                if (needleUser == undefined) {
                    usersToSend.push({ user: user, immobilien: [immobilie] });
                } else {
                    needleUser.immobilien.push(immobilie);
                }
                user.seenOffers.push(immobilie);
            }
        });
    });

    return usersToSend;
}

module.exports.subscribeUser = subscribeUser;
module.exports.unsubscribeUser = unsubscribeUser;
module.exports.getUsersOffers = getUsersOffers;