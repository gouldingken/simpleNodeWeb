var http = require("http");

var app;
app = http.createServer(function (req, res) {
    var postDataStr = "";

    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postDataStr += postDataChunk;
    });
    req.addListener("end", function () {
        res.writeHeader(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify({
            result: 'test env',
            env: 'testVar_' + process.env.APIKEY + '_' + process.env.PORT,
            mem: 'mem '+process.env.MEMC_PATH
        }));
        res.end();
    });
});
app.listen(80);//, '127.0.0.1');
console.log('Server running at http://127.0.0.1:80/');
console.log('VARS: '+ process.env.APIKEY + '_' + process.env.PORT);