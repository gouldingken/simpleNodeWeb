var http = require("http");
var url = require('url');

var logger = require("./server/modules/logger");
var distc = require("./server/modules/core/distCache");

logger.log('---------------starting simpleNodeWeb');
var connected = false;
/** @type DistCache */
var distCache = new distc.DistCache(distc.cacheTypes.MEMCACHE, function () {
    connected = true;
});

var _testMem = function (setKey, getKey, name, callback) {
    setKey = setKey || 'structured';
    getKey = getKey || 'structured';
    name = name || 'unknown';

    var structured = {
        name: name,
        age: 35,
        kids: ['joe', 'pete']
    };

    distCache.set(setKey, structured, function () {
        distCache.get(getKey, function (val) {
            callback(val);
        })
    });

};

var _getQuery = function (req) {
    var url_parts = url.parse(req.url, true);
    return url_parts.query;
};

var app;
app = http.createServer(function (req, res) {
    var postDataStr = "";

    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postDataStr += postDataChunk;
    });
    req.addListener("end", function () {
        var q = _getQuery(req);
        _testMem(q.setKey, q.getKey, q.name, function (ans) {
            res.writeHeader(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(ans));
            res.end();
        });
    });
});
app.listen(80);//, '127.0.0.1');
console.log('Server running at http://127.0.0.1:80/');
//console.log('VARS: '+ process.env.APIKEY + '_' + process.env.PORT);