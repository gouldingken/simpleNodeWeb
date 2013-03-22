var http = require("http");
var route = require("./modules/router");
var config = require("./modules/config");

require('http').globalAgent.maxSockets = 100000;//allow plenty of connections for long-running CartoDB tiles
require('https').globalAgent.maxSockets = 1000;//mostly for loggly

//--this needs to work the same way whether you use the apps internal server.js file or a the main server's server.js file

//var domain = 'apps.sasaki.com';
var domain = 'apps.localhost';

/** @type Router */
var router = new route.Router();
router.route('myc.' + domain, ['*'], require('./apps/myc/mycApp'));
router.route('collaboration.' + domain, ['res', 'test', 'secure'], require('./apps/collaboration/adjApp'));
//router.route('cg.apps.sasaki.com', ['*'], require('./apps/crowdgauge/cgApp'));

var app;
app = http.createServer(function (req, res) {
    router.handleReq(req, res, function () {
        res.writeHeader(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify({error: 'nothing to see here'}));
        res.end();
    });
});
app.listen(config.port);//, '127.0.0.1');
console.log('Server running at http://127.0.0.1:' + config.port + '/');