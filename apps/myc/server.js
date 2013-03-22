var http = require("http");
var https = require("http");
var config = require("./config");

http.globalAgent.maxSockets = 100000;//allow plenty of connections for long-running CartoDB tiles
https.globalAgent.maxSockets = 1000;//mostly for loggly

/** @type MycApp */
var mycApp = require('./mycApp');
var app;
app = http.createServer(function (req, res) {
    mycApp.serve(req, res);
});
app.listen(config.port);//, '127.0.0.1');


