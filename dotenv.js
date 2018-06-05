const dotenv = require('dotenv');
const json = require('format-json');
const _ = require('lodash');
const sharedConfig = dotenv.config({path: '../../.env'});
const localConfig = dotenv.config();

if (sharedConfig.error) {
    //throw sharedConfig.error
}

if (localConfig.error) {
    //throw localConfig.error
}

//console.log(json.plain(_.extend(sharedConfig.parsed, localConfig.parsed)));
