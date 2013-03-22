//region node.js core
var path = require('path');
//endregion
//region npm modules
var nodeStatic = require('node-static');
//endregion
//region modules

//endregion

/**
 @class MycApp
 */
MycApp = function () {
    var _self = this;

    //region private fields and methods
    var _subServants = {};

    //--should all the core code for this kind of thing be placed in a NPM-able repo that we maintain?
    var _addSubdomainDir = function (subdomain, relativePath) {
        var cliPath = path.resolve(__dirname, relativePath);
        _subServants[subdomain] =  new (nodeStatic.Server)(cliPath);
    };

    var _init = function () {
        //--order of operations:
        //--first check if its a web service request -- handle with '_handles'
        //--next check if its a client file request -- serve with node_static
        //--should I just manually configure a bunch of node static servers and their subdomain mappings?

        //--this should probably be automated from a file listing of the 'branches' dir.
        _addSubdomainDir('brown', 'client/branches/brown');//e.g. brown.myc.apps.sasaki.com OR brown.testmyc.sasakistrategies.com OR brown.localhost
        _addSubdomainDir('green', 'client/branches/green');
        _addSubdomainDir('pink', 'client/branches/pink');
    };

    //endregion

    //region public API
    this.serve = function (req, res) {
        //test subdomain
        var subdomain = req.headers.host.split('.')[0];
        if (_subServants[subdomain]) {
            _subServants[subdomain].serve(req, res);
            return;
        }
        res.writeHeader(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify({message: 'MyCampus server serving'}));
        res.end();
    };
    //endregion

    _init();
};

module.exports = new MycApp();

