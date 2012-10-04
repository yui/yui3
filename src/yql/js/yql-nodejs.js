/**
* NodeJS plugin for YQL to use native request to make requests instead of JSONP.
* Not required by the user, it's conditionally loaded and should "just work".
* @module yql
* @submodule yql-nodejs
*/

var request = require('request');

//Over writes Y.YQLRequest._send to use request instead of JSONP
Y.YQLRequest.prototype._send = function (url, o) {
    request(url, {
        method: 'GET',
        timeout: o.timeout || (30 * 1000)
    }, function(err, res) {
        if (err) {
            //The signature that YQL requires
            o.on.success({
                error: err
            });
        } else {
            o.on.success(JSON.parse(res.body));
        }
    });
};
