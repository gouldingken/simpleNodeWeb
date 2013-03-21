var http = require("http");
var logger = require("./server/modules/logger");
var distc = require("./server/modules/core/distCache");

logger.log('---------------starting simpleNodeWeb');
var connected = false;
/** @type DistCache */
var distCache = new distc.DistCache(distc.cacheTypes.MEMCACHE, function () {
    connected = true;
});

var _testMem = function (callback) {
    var v1;
    var v2;
    var cb = function () {
        if (v1 && v2) callback({v1: v1, v2: v2});
    };
    var structured = {
        name: 'fred',
        age: 35,
        kids: ['joe', 'pete']
    };

    distCache.set('structured', structured, function () {
        logger.log('set structured');
        distCache.get('structured', function (val) {
            logger.log('got structured');
            if (!val) {
                v2 = 'err';
            } else {
                v2 = val;
            }
            cb();
        })
    });

    distCache.set('btest', 500, function () {
        logger.log('set btest');
        distCache.get('btest', function (val) {
            logger.log('got btest');
            if (!val) {
                v1 = 'err';
            } else {
                v1 = val;
            }
            cb();
        })
    });
};

var app;
app = http.createServer(function (req, res) {
    var postDataStr = "";

    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postDataStr += postDataChunk;
    });
    req.addListener("end", function () {
        _testMem(function (ans) {
            res.writeHeader(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(ans));
            res.end();
        });
    });
});
app.listen(80);//, '127.0.0.1');
console.log('Server running at http://127.0.0.1:80/');
//console.log('VARS: '+ process.env.APIKEY + '_' + process.env.PORT);