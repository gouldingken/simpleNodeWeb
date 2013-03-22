//region node.js core

//endregion
//region npm modules

//endregion
//region modules

//endregion

/**
 @class Router
 */
Router = function () {
    var _self = this;
    var _routes = [];

    //region private fields and methods
    var _tryRoute = function (req, hostname, success, failure) {
        var regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '\\$&').replace(/[*]/g, '(?:.*?)') + '$', 'i');
        var host = req.headers.host.split(':')[0];
        if (regexp.test(host)) {
            success();
        } else {
            failure();
        }
    };

    //endregion

    //region public API
    this.handleReq = function (req, res, fallback) {
        var i = -1;
        var domains = [];
        var cRoute;
        var nextDomain = function (fn) {
            if (domains.length == 0) {
                i++;
                if (i >= _routes.length) {
                    fallback();
                    return;
                }
                cRoute = _routes[i];
                domains = cRoute.domains.slice(0);//shallow copy
            }
            fn(domains.shift(), cRoute);
        };
        var nextRoute = function () {
            nextDomain(function (domain, cRoute) {
                _tryRoute(req, domain, function () {
                    cRoute.app.serve(req, res);
                }, function () {
                    nextRoute();
                });
            });

        };
        nextRoute();
    };

    this.route = function (hostname, subdomains, app, callback) {
        var allDomains = [hostname].concat(subdomains.map(function (v) {
            return v + '.' + hostname;
        }));
        _routes.push({domains: allDomains, app: app, callback: callback});
    };
    //endregion

};


module.exports.Router = Router;

