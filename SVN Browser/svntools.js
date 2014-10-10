var app = require('./app.js')
var https = require('https')
var xml2js = require('xml2js')
var tools = require('./tools.js')

exports.repos = function (auth, callback) {
    exports.getSvnFolder('', auth, callback)
}
exports.getSvnFolder = function (path, auth, callback) {
    var options = {
        host: app.getSetting('svnserver'),
        method: 'GET',
        path: '/svn/' + encodeURIComponent(path).replace(/%2F/g, '/'),
        auth: tools.readFromSession(auth, 'username') + ':' + tools.readFromSession(auth, 'password')
    }
    try {
        https.request(options, function (res) {
            var result = []
            try {
                var data = ''
                res.on('data', function (chunk) {
                    data += chunk
                })
                res.on('end', function () {
                    var parseString = xml2js.parseString;
                    parseString(data, function (err, result) {
                        callback(result)
                    });
                })
                res.on('error', function (err) {
                    console.error(err)
                })
            } catch (ex) {
                console.error(ex)
            }
        }).end()
    } catch (ex) {
        console.error(ex)
        callback([])
    }
}
exports.getSvnFile = function (path, auth, callback) {
    var options = {
        host: app.getSetting('svnserver'),
        method: 'GET',
        path: '/svn/' + encodeURIComponent(path).replace(/%2F/g, '/'),
        auth: tools.readFromSession(auth, 'username') + ':' + tools.readFromSession(auth, 'password')
    }
    try {
        https.request(options, function (res) {
            var result = []
            res.setEncoding('binary')
            try {
                console.log('STATUS: ' + res.statusCode)
                console.log('CONTENT-TYPE: ' + res.headers['content-type'])
                var data = ''
                res.on('data', function (chunk) {
                    data += chunk
                })
                res.on('end', function () {
                    callback(data, res.headers['content-type'])
                })
                res.on('error', function (err) {
                    console.error(err)
                })
            } catch (ex) {
                console.error(ex)
            }
        }).end()
    } catch (ex) {
        console.error(ex)
        callback([])
    }
}