const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const https = require('https');
const database = require('./database');

async function scrape() {
    console.log(`Begin scraping`);
    let startTimeStamp = new Date();
    let html = await loadStartingPageHtml();
    let offers = getOffersFromHtml(html);
    let parsedOffers = parseOffers(offers);
    database.addOfferIfNotExists(parsedOffers);
    let response;
    let added = true;
    while ((response == undefined || JSON.parse(response).content != '201') && added) {
        response = await loadStreamHtml(parsedOffers);
        offers = getOffersFromHtml(JSON.parse(response).content);
        let newParsedOffers = parseOffers(offers);
        parsedOffers = parsedOffers.concat(newParsedOffers);
        parsedOffers = [...new Set(parsedOffers)]; // remove duplicates
        added = database.addOfferIfNotExists(parsedOffers);
    }
    console.log(`Finished scraping, found ${parsedOffers.length} offers after ${(new Date() - startTimeStamp) / 1000} seconds`);
}

function getOffersFromHtml(html) {
    let document = new JSDOM(html).window.document;
    let offers = Array.from(document.getElementsByClassName('article-preview__item'));// service-teaser article-preview__item__style__masonry grid-4 grid-mobile-12 grid-tablet-6 service-type-kleinanzeige'));
    return offers;
}

function parseOffers(offers) {
    let parsedOffers = [];
    for (let i = 0; i < offers.length; i++) {
        let offer = offers[i];
        //if(offer.children[2].children.length == 5) { // paid offer
        //    offer.children[2].removeChild(offer.children[2].children[0]);
        //}
        let newOffer = {
            offerId: getId(offer),
            title: getTitle(offer),
            description: getDescription(offer),
            createDate: getDate(offer),
            originalPoster: getUser(offer),
            phone: getPhone(offer),
            imageUrl: getImageUrl(offer),
            type: getType(offer),
            scrapeDate: new Date()
        }
        parsedOffers.push(newOffer);
    }
    return parsedOffers;
}

async function loadStreamHtml(offers) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'www.dolomitenstadt.at',
            port: 443,
            path: '/api/stream/',
            method: 'POST'
        }
        let text = '';
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

        // aggregate all offer ids
        let postIds = offers.reduce(function (acc, curr) {
            return { offerId: acc.offerId + '|' + curr.offerId }
        }).offerId;

        let postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"reload_type\"\r\n\r\nkleinanzeige\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"reload_count\"\r\n\r\n50\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"reload_action\"\r\n\r\nreload\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"reload_posts\"\r\n\r\n<%POSTIDS%>\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"reload_tag\"\r\n\r\nundefined\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"reload_ads\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"reload_category\"\r\n\r\n\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
        postData = postData.replace('<%POSTIDS%>', postIds);

        req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

        req.write(postData);
        req.end()
    });
}

async function loadStartingPageHtml() {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'www.dolomitenstadt.at',
            port: 443,
            path: '/kleinanzeigen/',
            method: 'GET'
        }
        let text = '';
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

function getId(offer) {
    return offer.getAttribute('data-id');
}

function getImageUrl(offer) {
    if (offer.children[0].children[0].children[1] != undefined) {
        return offer.children[0].children[0].children[1].href;
    } else {
        return undefined;
    }
}

function getTitle(offer) {
    if (offer.children[0].children.length > 1) {
        return offer.children[0].children[1].children[0].children[0].children[0].innerHTML.replace('\n', '').replace('\t', '');
    } else {
        return offer.children[0].children[0].children[0].children[0].children[0].innerHTML.replace('\n', '').replace('\t', '');
    }
}

function getDescription(offer) {
    if (offer.children[0].children.length > 1) {
        return offer.children[0].children[1].children[1].children[0].innerHTML;
    } else {
        return offer.children[0].children[0].children[1].children[0].innerHTML;
    }
}

function getPhone(offer) {
    if (offer.children[0].children.length > 1) {
        return offer.children[0].children[1].children[2].children[0].children[0].innerHTML;
    } else {
        return offer.children[0].children[0].children[2].children[0].children[0].innerHTML;
    }
}

function getUser(offer) {
    //return offer.children[2].children[2].children[1].innerHTML;
    return undefined;
}

function getDate(offer) {
    //if (offer.children[2].children[2].children.length == 2) {
    //    return "";
    //}
    //return offer.children[2].children[2].children[2].innerHTML;
    return new Date().toLocaleDateString("de-DE", { year: 'numeric', month: 'long', day: 'numeric' });
}

function getType(offer) {
    if(offer.children[0].children[0].children[0].children[0].children.length > 0) {
        return null;//offer.children[0].children[0].children[0].children[0].children[0].innerHTML;
    }else{
        return offer.children[0].children[0].children[0].children[0].innerHTML;
    }
    
}

module.exports.scrape = scrape;