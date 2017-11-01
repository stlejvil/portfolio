#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var serveStatic = require('serve-static');

var server = express();
server.engine('jade', require('jade').__express);
server.use(serveStatic('public'));

server.ipaddress  = process.env.OPENSHIFT_NODEJS_IP;
server.port       = process.env.OPENSHIFT_NODEJS_PORT || 8080;

server.get('/', function(req, res) {
    res.render('index.jade');
});

server.listen(server.port, server.ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), server.ipaddress, server.port);
});