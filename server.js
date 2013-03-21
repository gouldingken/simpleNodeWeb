var http = require("http");
var logger = require("./server/modules/logger");
var distc = require("./server/modules/core/distCache");

var connected = false;
/** @type DistCache */
var distCache = new distc.DistCache(distc.cacheTypes.MEMCACHE, function() {
    connected = true;
});

logger.log('starting simpleNodeWeb');

var _testMem = function (callback) {
    distCache.set('atest', 100, function() {
        distCache.get('atest', function(val) {
            callback(val);
        })
    })
};

var app;
app = http.createServer(function (req, res) {
    var postDataStr = "";

    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postDataStr += postDataChunk;
    });
    req.addListener("end", function () {
        _testMem(function(ans) {
            res.writeHeader(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(ans));
            res.end();
        });
    });
});
app.listen(80);//, '127.0.0.1');
console.log('Server running at http://127.0.0.1:80/');
//console.log('VARS: '+ process.env.APIKEY + '_' + process.env.PORT);