//region node.js core

//endregion
//region npm modules

//endregion
//region modules
var config = require("../../config");
var logger = require("../logger");
//endregion

/** @enum {Number} */
cacheTypes = {
    REDIS:0,
    MEMCACHE:1,
    NONDISTRIBUTED:2  //--Useful for testing locally. Can be used on single drones only.
};

/**
 * a wrapper for distributed caches that can talk either redis or memcache
 @class DistCache
 */
DistCache = function (type, onReady) {
    var _self = this;

    //region private fields and methods
    var _type = type || cacheTypes.REDIS;
    var _onReady = onReady;
    var _redCli;
    var _memCli;
    var _nondist;

    var _get;
    var _set;
    var _appendList;

    var _toArray = function (objArr) {
        var ans = [];
        var isSimpleArr = true;//--make sure this is just an array, not an object that happens to have "0" as one of its keys.
        Object.keys(objArr).forEach(function (k) {
            var isInteger = /^[0-9]+$/.test(k);
            if (!isInteger) isSimpleArr = false;
            if (isSimpleArr) {
                ans.push(objArr[k]);
            }
        });
        return (isSimpleArr) ? ans : objArr;
    };

    var _init = function () {
        if(_type == cacheTypes.NONDISTRIBUTED) {
            if (_nondist) return;//already configured
            _nondist = {};
            _get = function (key, callback) {
                callback(_nondist[key]);
            };
            _set = function (key, val, callback) {
                _nondist[key]=val;
                if(callback) callback();
            };
            if (_onReady) _onReady();
        } else if (_type == cacheTypes.REDIS) {
            logger.log('Connecting to REDIS');
            var redis = require('redis');
            //redis.debug_mode = true;//TEMP
            _redCli = redis.createClient(config.redis.port, config.redis.host);
            _redCli.on("error", function (err) {
                //_redCli.end();--seems to throw an error
                console.log("REDIS Error " + err);
                _type = cacheTypes.NONDISTRIBUTED;
                _init();
            });
            _redCli.auth(config.redis.key, function (err) {
                if (err) {
                    throw err;
                }
                // You are now connected to your redis.
                if (_onReady) _onReady();
            });

            _get = function (key, callback) {
                //console.log('getting from cache: ' + key);
                _redCli.hgetall(key, function (err, obj) {
                    if (!err) {
                        if (obj && obj[0]) obj = _toArray(obj);//Arrays are stored as hashes with numeric keys - make it back into a true Array object.
                        callback(obj);
                    }
                });
            };

            _set = function (key, val, callback) {
                //console.log('setting cache: ' + key);
//                if (typeof val !== 'string') {
//                    val = JSON.stringify(val);
//                }
                _redCli.hmset(key, val, function (err) {
                    if (callback) callback();
                });
            };

            _appendList = function (key, val, callback) {
                _redCli.rpush(key, val, function () {
                    if (callback) callback();
                });
            };
        } else {
            logger.log("Connecting to memcached...");
            var mc = require('mc');
            _memCli = new mc.Client(config.memcached.host, mc.Adapter.json);//:11211
            _memCli.connect(function () {
                logger.log("Connected to memcache");
                if (_onReady) _onReady();
            });

            _get = function (key, callback) {
                _memCli.get(key, function (err, response) {
                        if (!err) {
                            callback(response[key]);
                        }
                    }
                );
            };

            _set = function (key, val, callback) {
                var oneDay = 60 * 60 * 24;
                _memCli.set(key, val, {flags:0, exptime:oneDay}, function () {
                    if (callback) callback();
                });
            };

            _appendList = function (key, val, callback) {
                _memCli.append(key, val, function (err, status) {
                    //console.log(status);
                    if (err) {
                        if (err == 'NOT_FOUND') {
                            _memCli.add(key, val, function (err, status) {
                                if (!err) {
                                    if (callback) callback();
                                }
                            });
                        }
                    } else {
                        if (callback) callback();
                    }
                });
            }
        }
    };

    //endregion

    //region public API
    /**
     * @param {String} key
     * @param {Function} callback
     */
    this.get = function (key, callback) {
        _get(key, callback);
    };

    /**
     * @param {String} key
     * @param {Object} value
     * @param {Function} [callback]
     */
    this.set = function (key, value, callback) {
        _set(key, value, callback);
    };

    this.appendList = function (key, val, callback) {
        _appendList(key, val, callback)
    };

    //endregion

    _init();
};


module.exports.cacheTypes = cacheTypes;
module.exports.DistCache = DistCache;

