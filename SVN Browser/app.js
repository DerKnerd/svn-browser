process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/**
 * Module dependencies.
 */

var express = require('express')
var session = require('express-session')
var routes = require('./routes')
var http = require('http')
var https = require('https')
var path = require('path')
var exphbs = require('express-handlebars')
var hbshelper = require('handlebars-helpers')

var app = express()
var hbs = exphbs.create({
    defaultLayout: 'layout'
});

hbshelper.register(hbs.handlebars, { marked: undefined })
hbs.handlebars.registerHelper('fileicon', function (filename) {
    if (filename.match(/([^\s]+(\.(jpg|png|gif|bmp))$)/))
        return 'fa-file-image-o'
    else if (filename.match(/([^\s]+(\.(cpp|cc|c|cxx|h|hpp|hxx|cs|vb|fs|js|html|css|xaml|xml|sql|bat))$)/))
        return 'fa-file-code-o'
    else if (filename.match(/([^\s]+(\.(doc|docm|docx|dotx|dotm|dot|docb|odt))$)/))
        return 'fa-file-word-o'
    else if (filename.match(/([^\s]+(\.(xls|xlt|xlm|xlsx|xlsm|xltx|xltm|xlsb|xla|xlam|xll|xlw))$)/))
        return 'fa-file-excel-o'
    else if (filename.match(/([^\s]+(\.(ppt|pot|pps|pptx|pptm|potx|potm|ppam|ppsx|ppsm|sldx|sldm))$)/))
        return 'fa-file-powerpoint-o'
    else if (filename.match(/([^\s]+(\.(pdf))$)/))
        return 'fa-file-pdf-o'
    else if (filename.match(/([^\s]+(\.(zip|7z|rar|gz|tar))$)/))
        return 'fa-file-archive-o'
    else if (filename.match(/([^\s]+(\.(txt|csv|log))$)/))
        return 'fa-file-text-o'
    else
        return 'fa-file-o'
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('port', process.env.PORT || 3000)
app.set('secureport', app.get('port') + 1)
app.set('svnserver', 'subversion')
app.use(express.bodyParser())
app.use(express.favicon())
app.use(express.json())
app.use(session({ secret: '{18165D59-08BB-40EF-BBA4-1220B623282B}' }))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index)
app.get('/search/:repo/*', routes.search)
app.get('/view/:repo/*', routes.view)
app.get('/login', routes.login)
app.post('/login', routes.loginPost)

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
})

exports.getSetting = function (key) { return app.get(key) }
exports.setSetting = function (key, value) { return app.set(key, value) }