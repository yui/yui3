#!/usr/bin/env node

/**
 * This is a Node.js-based HTTP server for the performance testing framework.
 * See the README for details.
 */

var fs       = require('fs'),
    http     = require('http'),
    mime     = require('./lib/mime'),
    parseURL = require('url').parse,
    path     = require('path'),
    sys      = require('sys'),

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
        this.end();
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
            this.end();
            return;
        }
    }

    // TODO: Currently, the last file extension is what determines the
    // Content-Type. Need to look into what the real ComboHandler does when
    // multiple file types are requested in a single request.
    this.res.headers['content-type'] = mimeType + ';charset=utf-8';
    this.end(response + "\n");
});

// Cross-domain request proxy. Currently this doesn't handle redirects of any
// kind. This is still a little rough, but it works.
server.get('/proxy/?', function () {
    var client,
        request,
        result = '',
        that   = this,
        url    = this.query.url;

    if (!url) {
        this.sendError(400, '400 Bad Request', 'Missing required "url" parameter.');
        this.end();
        return;
    }

    url = parseURL(url);

    if (!url.hostname) {
        url.port     = config.server.port;
        url.hostname = config.server.host;
        url.host     = url.hostname + ':' + url.port;
    }

    if (!proxyWhitelist(url.hostname)) {
        this.sendError(403, '403 Forbidden', 'Proxy whitelist does not allow the requested URL.');
        this.end();
        return;
    }

    if (!url.pathname) {
        url.pathname = '/';
    }

    if (url.pathname.charAt(0) !== '/') {
        url.pathname = '/' + url.pathname;
    }

    client  = http.createClient(url.port || 80, url.hostname, url.protocol === 'https:');
    request = client.request((url.pathname || '/') + (url.search || ''), {host: url.host});

    request.addListener('response', function (response) {
        var header;

        // Copy status and headers from the remote response to our response.
        that.res.status = response.statusCode;

        for (header in response.headers) {
            if (response.headers.hasOwnProperty(header)) {
                that.res.headers[header.toLowerCase()] = response.headers[header];
            }
        }

        response.addListener('data', function (chunk) {
            result += chunk;
        });

        response.addListener('end', function () {
            that.end(result);
        });
    });

    request.end();
});

server.listen(config.server.port, config.server.host);

// -- Private Methods ----------------------------------------------------------
function proxyWhitelist(hostname) {
    return hostname === config.server.host ||
            (config.proxy &&
                config.proxy.hostnames &&
                config.proxy.hostnames.indexOf(hostname) !== -1);
}

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
