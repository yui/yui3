#!/usr/bin/env node

var fs     = require('fs'),
    http   = require('http'),
    path   = require('path'),
    sys    = require('sys'),

    config = readConfig('conf/config.json'),
    server = require('./lib/router').Server();

// -- Implementation -----------------------------------------------------------

// Combo URLs.
server.get('/combo/([^/]+)/?', function (root) {
    var fullPath,
        relativePath,
        response = '',
        rootPath = config.roots[root];

    if (!rootPath) {
        this.send404();
        return;
    }

    for (relativePath in this.query) {
        if (!this.query.hasOwnProperty(relativePath)) {
            continue;
        }

        fullPath = path.join(rootPath, relativePath);

        try {
            response += fs.readFileSync(fullPath, 'utf8') + "\n";
        } catch (ex) {
            this.send404();
            return;
        }
    }

    this.res.headers['content-type'] = 'application/javascript;charset=utf-8';
    return response;
});

server.listen(config.server.port, config.server.host);

// -- Private Methods ----------------------------------------------------------
function readConfig(filename) {
    var configJSON;

    try {
        configJSON = fs.readFileSync(filename, 'utf8');
    } catch (ex) {
        sys.puts('Error: Config file not found: ' + filename);
        return {};
    }

    try {
        return JSON.parse(configJSON);
    } catch (ex) {
        sys.puts('Error parsing config file: ' + ex.toString());
        return {};
    }
}
