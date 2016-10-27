var https = require('https')
var Future = require('futures').future
//var config = require('./config')

var request_wit = function(user_text) {
    var future = Future.create();
    var options = {
        host: 'api.wit.ai',
        path: '/message?n=1&q=' + encodeURIComponent(user_text),
        headers: {'Authorization': 'Bearer ' + process.env.WIT_TOKEN,
                  'Accept': 'application/vnd.wit.20140620'}
    };
    https.request(options, function(res) {
        var response = '';
        res.on('data', function (chunk) {response += chunk;});
        res.on('end', function () {
            future.fulfill(undefined, JSON.parse(response));
        });

    }).on('error', function(e) {
            future.fulfill(e, undefined);
        }).end();
    return future;
}

module.exports.request_wit = request_wit;