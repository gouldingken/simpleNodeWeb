//region node.js core
var util = require('util');
//endregion
//region npm modules

//endregion
//region modules
var dc = require('./distCache');
//endregion

/**
 * a cache that will store values or create new ones only if needed. cache can be cleared if anything changes and the values need to be recalculated.
 @class LazyCache
 */
LazyCache = function (prefix, onReady) {
    var CACHE_REGISTER = "CACHE_REGISTER";
    var _self = this;
    //region private fields and methods
    /** @type DistCache */
    var _distCache;
    var _prefix = prefix || '';
    var _onReady = onReady;

    var _init = function () {
        _distCache = new dc.DistCache(dc.cacheTypes.REDIS, function() {
            console.log("LazyCache connected");
            if (_onReady) _onReady();
        });
    };

    var _appendList = function (ck, val, callback) {
        _distCache.appendList(ck, val, callback);
    };

    var _clearCache = function () {
        _distCache.get(_prefix + CACHE_REGISTER, function (err, response) {
            var list = response[_prefix + CACHE_REGISTER];
            console.log(list);
            //loop over list and run delete
        });
    };

    var _registerKey = function (key) {
        _appendList(_prefix + CACHE_REGISTER, key);
    };

    var _addItem = function () {

    };

    var _getOrAdd = function (ck, factoryFn, useFn) {
        _distCache.get(ck, function (valFromCache) {
            if (!valFromCache) {
                factoryFn(function (val) {
                    _distCache.set(ck, val, function (err, status) {
                        useFn(val);
                    });
                });
            } else {
                useFn(valFromCache);
            }
        });
    };

    //endregion

    //region public API
    /**
     * @param key
     * @param {Function} factoryFn a function that receives a return handler as a parameter
     * @param {Function(object)} useFn the function to run either after getting the value from the cache or after creating the value
     */
    this.getOrAdd = function (key, factoryFn, useFn) {
        _getOrAdd(_prefix + key, factoryFn, useFn);
    };

    this.clearCache = function () {
        //how do we know what values in the memcache belong to this group? is it just by prefix?
        //we can store a list for this cache
    };
    //endregion

    _init();
};

module.exports.LazyCache = LazyCache;

