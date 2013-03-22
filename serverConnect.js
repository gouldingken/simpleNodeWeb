/**
 * User: kgoulding
 * Date: 3/21/13
 * Time: 6:44 PM
 */

var connect = require('connect');

var account = connect(function (req, res) {
    var location = 'http://localhost:3000/account/' + req.subdomains[0];
    res.statusCode = 302;
    res.setHeader('Location', location);
    res.end('Moved to ' + location);
});

var blog = connect(function (req, res) {
    res.end('blog app');
});

var main = connect(
    connect.router(function (app) {
        app.get('/account/:user', function (req, res) {
            res.end('viewing user account for ' + req.params.user);
        });

        app.get('/', function (req, res) {
            res.end('main app');
        });
    })
);

connect(
    connect.logger()
    , connect.vhost('blog.localhost', blog)
    , connect.vhost('*.localhost', account)
    , main
).listen(3000);

//connect uses a pattern of req, res, next
//so you can set up a nice pattern where you just pass a bunch of stuff that takes precedence.
//For example, every request goes to logger first (if you like) then it calls next.
//other servers will handle a request and then not call next (in which case the request is done with)
//C:\Users\kgoulding\Documents\Development\Javascript\node\simpleNodeWeb\node_modules\connect\lib\middleware\vhost.js
