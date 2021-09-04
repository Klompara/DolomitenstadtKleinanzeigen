const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const https = require('https');
const database = require('./database');

function scrape() {
    loadStartingPageHtml().then(html => {
        let document = new JSDOM(html).window.document;
        let offers = Array.from(document.getElementsByClassName('page__kleinanzeigen__item clearfix'));
        let parsedOffers = [];
        for (let i = 0; i < offers.length; i++) {
            let offer = offers[i];
            let newOffer = {
                offerId: getId(offer),
                title: getTitle(offer),
                description: getDescription(offer),
                createDate: getDate(offer),
                originalPoster: getUser(offer),
                phone: getPhone(offer),
                imageUrl: getImageUrl(offer),
                type: getType(offer)
            }
            parsedOffers.push(newOffer);
        }
        database.addOfferIfNotExists(parsedOffers);
    }).catch(err => {
        console.error(err);
    });
}

function getId(offer) {
    return offer.id.replace('kleinanzeige-', '');
}

function getImageUrl(offer) {
    if (offer.children[0].classList[1] == undefined) {
        return offer.children[0].children[0].children[0].children[0].href;
    } else {
        return undefined;
    }
}

function getTitle(offer) {
    return offer.children[2].children[0].innerHTML.replace('\n', '').replace('\t', '');
}

function getDescription(offer) {
    return offer.children[2].children[1].children[0].innerHTML;
}

function getPhone(offer) {
    if (offer.children[2].children[1].childElementCount > 1) {
        return offer.children[2].children[1].children[1].innerHTML;
    } else {
        return undefined;
    }
}

function getUser(offer) {
    return offer.children[2].children[2].children[1].innerHTML;
}

function getDate(offer) {
    return offer.children[2].children[2].children[2].innerHTML;
}

function getType(offer) {
    return offer.children[2].children[2].children[0].children[0].innerHTML;
}

async function loadStartingPageHtml() {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'www.dolomitenstadt.at',
            port: 443,
            path: '/kleinanzeigen/',
            method: 'GET'
        }
        let text;
        let req = https.request(options, res => {
            res.on('data', function (chunk) {
                text += chunk;
            });
            res.on('end', function () {
                resolve(text);
            });
        })

        req.on('error', error => {
            reject(error);
        })

        req.end()
    });
}

module.exports.scrape = scrape;