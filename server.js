var http = require("http");
var logger = require("./server/modules/logger");
var distc = require("./server/modules/core/distCache");

var connected = false;
var distCache = new distc.DistCache(distc.cacheTypes.MEMCACHE, function() {
    connected = true;
});

logger.log('starting simpleNodeWeb');

var app;
app = http.createServer(function (req, res) {
    var postDataStr = "";

    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postDataStr += postDataChunk;
    });
    req.addListener("end", function () {
        res.writeHeader(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify({
            result: 'test env',
            env: 'testVar_' + process.env.APIKEY + '_' + process.env.PORT,
            connected: connected
        }));
        res.end();
    });
});
app.listen(80);//, '127.0.0.1');
console.log('Server running at http://127.0.0.1:80/');
//console.log('VARS: '+ process.env.APIKEY + '_' + process.env.PORT);