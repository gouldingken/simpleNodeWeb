//region node.js core

//endregion
//region npm modules

//endregion
//region modules

//endregion

module.exports.contentTypeIsJSON = function (req) {
    if (!req.headers || !req.headers['content-type']) return false;
    //ignore the last part after the ';' e.g. for 'application/json; charset=UTF-8'
    return req.headers['content-type'].split(";")[0] == 'application/json';
};

