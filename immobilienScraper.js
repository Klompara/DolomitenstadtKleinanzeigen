const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const https = require('https');

function getAllCurrentImmobilien() {

    const dom = new JSDOM(`<!DOCTYPE html><p id="test">JSDOM Hello world!</p>`);
    console.log(dom.window.document.getElementById('test').innerHTML);
}

module.exports.getAllCurrentImmobilien = getAllCurrentImmobilien;