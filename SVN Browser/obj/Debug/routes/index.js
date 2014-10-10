var app = require('../app.js')
var tools = require('../tools.js')
var svntools = require('../svntools.js')

exports.index = function (req, res) {
    tools.checkAuth(req, res, function () {
        svntools.repos(req.session, function (result) {
            result.svn.index[0].dir.sort(function (a, b) {
                return a.$.name.toLocaleUpperCase().localeCompare(b.$.name.toLocaleUpperCase())
            })
            var data = {
                title: 'Startseite',
                repos: result.svn
            }
            res.render('index', data);
        })
    })
};
exports.search = function (req, res) {
    tools.checkAuth(req, res, function () {
        var params = req.params
        svntools.repos(req.session, function (result) {
            var uri = params.repo + '/'
            var currentposition = [{ link: '/search/' + params.repo + '/', foldername: params.repo }]
            params.forEach(function (entry) {
                uri += entry
                var bcUri = '/' + params.repo
                entry.split('/').forEach(function (item) {
                    if (item !== '') {
                        bcUri += '/' + item
                        currentposition.push({ link: '/search' + bcUri + '/', foldername: item })
                    }
                })
            })
            svntools.getSvnFolder('/' + uri, req.session, function (directories) {
                var content = directories.svn
                var data = {
                    title: uri,
                    repos: result.svn,
                    currentposition: currentposition,
                    content: content
                }
                res.render('search', data);
            })
        })
    })
}
exports.view = function (req, res) {
    tools.checkAuth(req, res, function () {
        var params = req.params
        svntools.repos(req.session, function (result) {
            var uri = params.repo + '/'
            var currentposition = [{ link: '/search/' + params.repo + '/', foldername: params.repo }]
            params.forEach(function (entry) {
                uri += entry
                var bcUri = '/' + params.repo
                entry.split('/').forEach(function (item) {
                    if (item !== '') {
                        bcUri += '/' + item
                        currentposition.push({ link: '/search' + bcUri + '/', foldername: item })
                    }
                })
            })
            svntools.getSvnFile('/' + uri, req.session, function (content, contenttype) {
                var data = {
                    title: uri,
                    repos: result.svn,
                    currentposition: currentposition,
                    content: content.trim(),
                    contenttype: contenttype,
                    name: currentposition[currentposition.length - 1],
                    href: 'https://' + app.getSetting('svnserver') + '/svn/' + uri
                }
                res.render('view', data);
            })
        })
    })
}
exports.login = function (req, res) {
    res.render('login');
}
exports.loginPost = function (req, res) {
    tools.storeInSession(req.session, 'username', req.body.username)
    tools.storeInSession(req.session, 'password', req.body.password)
    res.redirect('/')
}