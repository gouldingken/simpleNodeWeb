//region node.js core

//endregion
//region npm modules

//endregion
//region modules

//endregion

/**
 @class AdjApp
 */
AdjApp = function () {
    var _self = this;

    //region private fields and methods
    var _init = function () {
    };

    //endregion

    //region public API
    this.serve = function (req, res) {
        res.writeHeader(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify({message: 'Collaboration server serving'}));
        res.end();
    };
    //endregion

    _init();
};

module.exports = new AdjApp();

