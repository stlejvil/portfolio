#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var serveStatic = require('serve-static');

var server = express();
server.engine('jade', require('jade').__express);
server.use(serveStatic('public'));

server.get('/', function(req, res) {
    res.render('index.jade');
});

server.listen(8080);