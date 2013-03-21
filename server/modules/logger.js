var loggly = require('loggly');
var config = require('../config');
var verbose = (process.env.NODE_ENV == 'production') ? 0 : 1;

var osId = require('os').hostname().split('-')[0];
var client = loggly.createClient(config.loggly.conf);
/**
 * @param {String} msg
 * @param {Number} [verbosity] an optional argument for the level of logging (0 = always log (errors and warnings), 1 = generally helpful debug info, 2 = temp (for a particular test), 3 = very verbose debugging)
 */
exports.log = function (msg, verbosity) {
    if (verbosity && verbosity > verbose) return;//don't log messages whose verbosity is greater than the current setting
    console.log(osId+'>'+msg);
    client.log(config.loggly.key, msg);
};