var app = require('./app.js')
var crypto = require('crypto')

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
exports.storeInSession = function (session, key, value) {
    var cipher = crypto.createCipher('aes-256-cbc', '{BECE365B-FF74-4135-87BE-5F42399B072D}')
    var crypted = cipher.update(value, 'utf8', 'base64')
    session[key] = crypted + cipher.final('base64')
}
exports.readFromSession = function (session, key) {
    if (session[key] != undefined) {
        var decipher = crypto.createDecipher('aes-256-cbc', '{BECE365B-FF74-4135-87BE-5F42399B072D}')
        var decrypted = decipher.update(session[key], 'base64', 'utf8')
        return decrypted + decipher.final('utf8')
    } else {
        return undefined
    }
}
exports.checkAuth = function (req, res, callback) {
    if (exports.readFromSession(req.session, 'username') == undefined || exports.readFromSession(req.session, 'password') == undefined) {
        res.redirect('/login')
    } else {
        try {
            callback()
        } catch (ex) {
            res.redirect('/login')
        }
    }
}
