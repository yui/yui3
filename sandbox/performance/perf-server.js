#!/usr/bin/env node

/**
 * This is a Node.js-based HTTP server for the performance testing framework.
 * See the README for details.
 */

var fs     = require('fs'),
    http   = require('http'),
    mime   = require('./lib/mime'),
    path   = require('path'),
    sys    = require('sys'),

    config = readConfig('conf/config.json'),
    server = require('./lib/router').Server();

// -- Implementation -----------------------------------------------------------

// Combo URLs.
server.get('/combo/([^/]+)/?', function (root) {
    var fullPath,
        mimeType,
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
        mimeType = mime.getType(path.extname(relativePath));

        try {
            response += fs.readFileSync(fullPath, 'utf8') + "\n";
        } catch (ex) {
            this.send404();
            return;
        }
    }

    // TODO: Currently, the last file extension is what determines the
    // Content-Type. Need to look into what the real ComboHandler does when
    // multiple file types are requested in a single request.
    this.res.headers['content-type'] = mimeType + ';charset=utf-8';
    return response + "\n";
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
