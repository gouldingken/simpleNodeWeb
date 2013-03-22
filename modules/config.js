var _port = process.env.PORT || 80;  //
module.exports.port = _port;

module.exports.verbosity = 0;
module.exports.memcached = {
    host: process.env.MEMC_HOST,
    port: process.env.MEMC_PORT //9859 = default redis port, use 6379 for iris
};
module.exports.loggly = {
    conf:{ subdomain:"sastrategies" },
    key:'cff26d28-f96c-4b38-8a2e-77b08deb1ad8'
};
