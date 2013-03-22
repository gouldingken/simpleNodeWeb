//region node.js core
var url = require('url');

//endregion
//region npm modules
var knox = require('knox');
//endregion
//region modules
var config = require("../../config");
//endregion

/**
 @class S3Bucket
 */
S3Bucket = function (bucket) {
    var _self = this;

    //region private fields and methods
    var _client;
    var _bucket = bucket;

    var _init = function () {
        _client = knox.createClient({
            key:config.s3.key,
            secret:config.s3.secret,
            bucket:_bucket,
            secure:true
        });
    };

    var _fetchFile = function (filename, res) {
        _client.get(filename)
            .on('response', function (s3res) {
                res.writeHeader(200, {"Content-Type":"image/svg+xml", "Content-Encoding":"gzip"});
                s3res.pipe(res);
            })
            .on('error', function(err) {
                res.writeHeader(200, {"Content-Type":"application/json"});
                res.write(JSON.stringify({err:err}));
                res.end();
            })
            .end();
    };
    //endregion

    //region public API
    this.fetchFile = function (id, res) {
        _fetchFile(id, res);
    };
    //endregion

    _init();
};

/**
 @class S3FloorPlans
 */
S3FloorPlans = function () {
    var _getQuery = function (req) {
        var url_parts = url.parse(req.url, true);
        return url_parts.query;
    };

    var _floorplan = function (req, res, reqData) {
        var qry = _getQuery(req);
        var clientId = qry["c"];
        var id = qry["id"];//.ToLower();
        var folder = qry["f"].toLowerCase();
        var bucket = new S3Bucket("viz_" + clientId);
        bucket.fetchFile(folder + "/" + id + '.svgz', res);
    };

    //region public API
    this.floorplan = function (req, res, reqData) {
        _floorplan(req, res, reqData);
    };
    //endregion
};


module.exports.S3FloorPlans = S3FloorPlans;
module.exports.S3Bucket = S3Bucket;

